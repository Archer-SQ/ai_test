import HmacSHA256 from 'crypto-js/hmac-sha256'
import Base64 from 'crypto-js/enc-base64'

const createHmac = (algorithm: string, key: string | Buffer | undefined) => ({
  update: (data: string) => ({
    digest: (encoding: string) => {
      if (!key) {
        throw new Error('HMAC key is undefined');
      }
      const hmac = HmacSHA256(data, key.toString());
      return encoding === 'base64' ? Base64.stringify(hmac) : hmac.toString();
    }
  })
});

const SPARK_API_URL = 'wss://spark-api.xf-yun.com/v3.5/chat'
const SPARK_APP_ID = process.env.REACT_APP_SPARK_APP_ID
const SPARK_API_KEY = process.env.REACT_APP_SPARK_API_KEY
const SPARK_API_SECRET = process.env.REACT_APP_SPARK_API_SECRET

function getWebsocketUrl(): string {
    if (!SPARK_API_SECRET) {
        throw new Error('SPARK_API_SECRET is undefined');
    }
    const host = 'spark-api.xf-yun.com'
    const path = '/v3.5/chat'
    const date = new Date().toUTCString()
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
    const signature = createHmac('sha256', SPARK_API_SECRET)
        .update(signatureOrigin)
        .digest('base64')
    const authorizationOrigin = `api_key="${SPARK_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    const authorization = Buffer.from(authorizationOrigin).toString('base64')

    return `${SPARK_API_URL}?authorization=${encodeURIComponent(
        authorization
    )}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(host)}`
}

export async function* generateStreamResponse(
    prompt: string,
    history: Array<{ role: string; content: string }>
): AsyncGenerator<string, void, unknown> {
    let retries = 0;
    const maxRetries = 3;

    while (true) {
        try {
            const url = getWebsocketUrl();
            const ws = new WebSocket(url);

            yield* await new Promise<AsyncGenerator<string, void, unknown>>((resolve, reject) => {
                const generator = (async function* () {
                    while (true) {
                        const data = await new Promise<string | Buffer | ArrayBuffer>((resolve, reject) => {
                            const handleMessage = (event: MessageEvent) => {
                                ws.removeEventListener('message', handleMessage);
                                resolve(event.data);
                            };
                            ws.addEventListener('message', handleMessage);
                            ws.addEventListener('error', (error) => {
                                reject(new Error(`WebSocket错误: ${error}`));
                            });
                        });
                        const response = JSON.parse(
                            typeof data === 'string' ? data : data.toString()
                        );
                        if (response.header.code !== 0) {
                            console.error(
                                `错误: ${response.header.code} - ${response.header.message}`
                            );
                            return;
                        }
                        const text = response.payload.choices.text[0].content;
                        for (const char of text) {
                            yield char;
                        }
                        
                        if (response.header.status === 2) {
                            ws.close();
                            return;
                        }
                    }
                })();

                ws.addEventListener('open', () => {
                    const data = {
                        header: {
                            app_id: SPARK_APP_ID,
                        },
                        parameter: {
                            chat: {
                                domain: 'generalv3.5',
                                temperature: 0.5,
                                max_tokens: 1024,
                            },
                        },
                        payload: {
                            message: {
                                text: [...history, { role: 'user', content: prompt }],
                            },
                        },
                    };

                    if (!SPARK_APP_ID) {
                        console.error('SPARK_APP_ID 未设置');
                        reject(new Error('SPARK_APP_ID 未设置'));
                        return;
                    }

                    ws.send(JSON.stringify(data));
                    resolve(generator);
                });

                ws.addEventListener('error', (error) => {
                    console.error('WebSocket连接错误:', error);
                    reject(error);
                });
            });

            return;
        } catch (error) {
            console.error('WebSocket连接错误:', error);
            retries++;
            if (retries >= maxRetries) {
                throw new Error('达到最大重试次数');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
