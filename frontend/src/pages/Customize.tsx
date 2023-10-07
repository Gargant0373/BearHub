import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Customize() {
    const location = useLocation();
    const navigate = useNavigate();
  
    if (!location.state) {
      navigate("/");
      return null;
    }
  
    const { name } = location.state as { name: string };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
      } catch (error: any) {
        console.error(error.message);
      }
    };
  
    return (
        <div>
            <h1>Customize</h1>
        </div>
    );
}

export default Customize();