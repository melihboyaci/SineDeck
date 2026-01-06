import React, { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import { Button, Navbar } from "flowbite-react";

const AppNavbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Navbar fluid rounded>
      <div className="flex md:order-2">
        <Button color="failure" size="xs" onClick={logout}>
          Çıkış Yap
        </Button>
      </div>
    </Navbar>
  );
};

export default AppNavbar;
