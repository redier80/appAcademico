import React, { useState, useEffect } from "react";
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
  Divider,
} from "rsuite";
import { FaGithub, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuth from "../services/useAuth";
import { useNavigate } from "react-router-dom";

// Componente de campo de contraseña
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

const LoginForm = () => {
  const [formValue, setFormValue] = useState({ username: "", password: "" });
  const { login, isLogged } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    await login(formValue.username, formValue.password.target.value);
  };

  useEffect(() => {
    if (isLogged) {
      navigate("/estudiantes");
    }
  }, [isLogged]);

  return (
    <Container className="relative  h-[90vh] text-white overflow-hidden ">
      <img
        src="/img/background.png"
        alt="fondo"
        className="absolute inset-0 w-full  object-cover z-0 pointer-events-none"
        style={{ opacity: 0.1 }}
      />
      <Header>
        <Navbar appearance="inverse" className="bg-black">
          <Navbar.Brand className="px-4 py-2">
            <div className="flex items-center gap-3">
              <img
                src="../public/img/brand-cid.png"
                alt="logo"
                className="h-8 object-contain"
              />
              <span className="text-white  whitespace-nowrap italic font-serif">
                Idiomas que te acercan al Mundo
              </span>
            </div>
          </Navbar.Brand>
        </Navbar>
      </Header>

      <Content>
        <div className="flex justify-center items-center h-[80vh]">
          <Panel
            header={<span className="text-white text-lg">Sign in</span>}
            bordered
            className="w-[400px] bg-gray-800 text-white rounded shadow-lg p-6"
          >
            <Form fluid formValue={formValue} onChange={setFormValue}>
              <Form.Group>
                <Form.ControlLabel>Usuario</Form.ControlLabel>
                <Form.Control name="username" type="text" />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Password</Form.ControlLabel>
                <Form.Control
                  name="password"
                  autoComplete="off"
                  accepter={Password}
                />
              </Form.Group>

              <div className="mt-4">
                <Button appearance="primary" block onClick={handleSubmit}>
                  Sign in
                </Button>
                <div className="mt-2 text-center">
                  <a href="#" className="text-sm text-blue-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
            </Form>

            <Divider className="my-4 border-gray-600">OR</Divider>

            <Button
              endIcon={<FaGithub />}
              block
              href="#"
              appearance="ghost"
              className="text-white border-gray-500 hover:bg-gray-700"
            >
              Continue with GitHub
            </Button>
          </Panel>
        </div>
      </Content>
    </Container>
  );
};

export default LoginForm;
