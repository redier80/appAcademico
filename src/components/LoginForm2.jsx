import React from "react";
import {
  Container,
  Header,
  Content,
  Navbar,
  Form,
  Button,
  Panel,
  Input,
  InputGroup,
  Stack,
  Divider,
} from "rsuite";
import { FaGithub, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// Componente de campo de contraseña con ícono de mostrar/ocultar
const Password = React.forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);

  const toggleVisibility = () => setVisible(!visible);

  return (
    <InputGroup inside {...props}>
      <Input ref={ref} type={visible ? "text" : "password"} />
      <InputGroup.Button onClick={toggleVisibility}>
        {visible ? <FaRegEye /> : <FaRegEyeSlash />}
      </InputGroup.Button>
    </InputGroup>
  );
});

const LoginForm = () => (
  <Container style={{ height: "80vh" }}>
    <Header>
      <Navbar appearance="inverse">
        <Navbar.Brand className="flex items-center gap-2">
          <img
            src="../public/img/brand-cid.png"
            alt="logo"
            style={{ height: "32px", marginRight: "8px", objectFit: "contain" }}
          />{" "}
          <p className="italic font-serif">
            Idiomassss que te acercan al Mundo
          </p>
        </Navbar.Brand>
      </Navbar>
    </Header>
    <Content>
      <Stack
        alignItems="center"
        justifyContent="center"
        style={{ height: "100%" }}
      >
        <Panel header="Sign in" bordered style={{ width: 400 }}>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Usuario</Form.ControlLabel>
              <Form.Control name="usuario" type="text" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                autoComplete="off"
                accepter={Password}
              />
            </Form.Group>

            <div style={{ marginTop: 20 }}>
              <Button appearance="primary" block>
                Sign in
              </Button>
              <div style={{ marginTop: 10 }}>
                <a href="#">Forgot password?</a>
              </div>
            </div>
          </Form>
        </Panel>
      </Stack>
    </Content>
  </Container>
);

export default LoginForm;
