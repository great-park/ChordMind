'use client'

import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import Link from 'next/link'
import { GRADIENTS, COLORS } from '../constants/styles'

const Header: React.FC = React.memo(() => {
  return (
    <Navbar 
      expand="lg" 
      style={{
        background: GRADIENTS.dark,
        borderBottom: `1px solid ${COLORS.primary.border}`
      }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          href="/"
          style={{ color: COLORS.text.primary }}
        >
          ChordMind
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse role="navigation">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              href="/"
              style={{ color: COLORS.text.secondary }}
            >
              홈
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/harmony-quiz"
              style={{ color: COLORS.text.secondary }}
            >
              화성 퀴즈
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/ai-features"
              style={{ color: COLORS.text.secondary }}
            >
              AI 기능
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/admin/quiz-management"
              style={{ color: COLORS.text.secondary }}
            >
              퀴즈 관리
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/admin/analytics-dashboard"
              style={{ color: COLORS.text.secondary }}
            >
              통계 대시보드
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
})

Header.displayName = 'Header'

export default Header 