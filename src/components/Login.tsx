import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void
}

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 200vw;
    height: 200vh;
    top: -50%;
    left: -50%;
    z-index: -1;
  }

  &::before {
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    animation: ${rotate} 20s linear infinite;
  }

  &::after {
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
    animation: ${rotate} 15s linear infinite reverse;
  }
`

const BubbleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Title = styled.h1`
  color: white;
  font-size: 36px;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  z-index: 1;
`

const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 300px;
  z-index: 1;
`

const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid ${props => props.error ? '#f44336' : '#ddd'};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#f44336' : '#4CAF50'};
  }
`

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 12px;
  margin: 0 0 15px 0;
  height: 15px;
`

class Bubble {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.radius = Math.random() * 20 + 10;
    this.x = Math.random() * (canvasWidth - this.radius * 2) + this.radius;
    this.y = Math.random() * (canvasHeight - this.radius * 2) + this.radius;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.color = `hsla(${Math.random() * 360}, 100%, 50%, 0.3)`;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(0.8, this.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
  }

  update(canvasWidth: number, canvasHeight: number) {
    if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
  }
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const bubbles: Bubble[] = []
    for (let i = 0; i < 50; i++) {
      bubbles.push(new Bubble(canvas.width, canvas.height))
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach(bubble => {
        bubble.update(canvas.width, canvas.height)
        bubble.draw(ctx)
      })
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const validateUsername = (value: string) => {
    if (!value) {
      setUsernameError('用户名不能为空')
      return false
    } else if (value.length < 2) {
      setUsernameError('用户名至少需要2个字符')
      return false
    } else {
      setUsernameError('')
      return true
    }
  }

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('密码不能为空')
      return false
    } else if (value.length < 6) {
      setPasswordError('密码至少需要6个字符')
      return false
    } else {
      setPasswordError('')
      return true
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const isUsernameValid = validateUsername(username)
    const isPasswordValid = validatePassword(password)

    if (isUsernameValid && isPasswordValid) {
      if (password === '123123') {
        setIsLoggedIn(true)
        sessionStorage.setItem('isLoggedIn', 'true')
        navigate('/home', { state: { username: username } })
      } else {
        setUsernameError('用户名或密码错误')
        setPasswordError('用户名或密码错误')
      }
    }
  }

  return (
    <LoginContainer>
      <BubbleCanvas ref={canvasRef} />
      <Title>欢迎登录</Title>
      <LoginForm onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={(e) => validateUsername(e.target.value)}
          error={!!usernameError}
          required
        />
        <ErrorMessage>{usernameError}</ErrorMessage>
        <Input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => validatePassword(e.target.value)}
          error={!!passwordError}
          required
        />
        <ErrorMessage>{passwordError}</ErrorMessage>
        <Button type="submit">登录</Button>
      </LoginForm>
    </LoginContainer>
  )
}

export default Login
