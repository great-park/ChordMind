'use client'

import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import Link from 'next/link'

const Header: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/">ChordMind</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">홈</Nav.Link>
            <Nav.Link as={Link} href="/harmony-quiz">화성 퀴즈</Nav.Link>
            <Nav.Link as={Link} href="/admin/quiz-management">퀴즈 관리</Nav.Link>
            <Nav.Link as={Link} href="/admin/analytics-dashboard">통계 대시보드</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header 