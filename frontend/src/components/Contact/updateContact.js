import React,{useState,useEffect} from "react";
import axios from "axios";
import {useNavigate,useParams} from "react-router-dom";
import Navigation from '../navigation/navigation'
function UpdateContact()
{
    const userName = useParams().userName;
    const firstName = useParams().firstName;
    const lastName = useParams().lastName;
    const [propertyToUpdate,updatepropertToUpdate] = useState("");
    const [value,updateValue] = useState("");
    const [loginStatus, updateloginStatus] = useState("")
    const [StatusOfUser,updateStatusOfUser] = useState("");

    let navigate = new useNavigate();
    const navToLogin = () => {
        navigate('/');
      };

    useEffect(() => {
        axios.post(`http://localhost:8082/api/v1/isUserLogin/${userName}`,{})
          .then((resp) => {
            updateloginStatus(true);
          })
          .catch((error) => {
            updateloginStatus(false);
          });
    }, [userName]);

    const onUpdateUser = async (e) =>{
        e.preventDefault()
        await axios.put(`http://localhost:8082/api/v1/updateContact/${userName}/${firstName}/${lastName}`,{propertyToUpdate,value})
        
        .then((resp)=>{
            updateloginStatus(true)
            alert("Successfully Updated");
            console.log(resp)
            updateStatusOfUser("Updated");
        })
        .catch((error)=>{
            updateloginStatus(false)
            alert(`Error ${error.response.data}`);
            updateStatusOfUser(error.response.message);
        })     
    }

    if (loginStatus === false) {
        console.log(loginStatus)
        return (
            <>
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                flexDirection: "column",
              }}
            >
              <p style={{ color: "white", fontSize: "30px" , background : "red"}}>
                User not logged in, Click Below to login :
              </p>
              <button onClick={navToLogin} type="submit" className="btn btn-primary" style={{ backgroundColor: "green" ,fontSize : "30px"}}>Login</button><br />
            </div>
          </>
        )
    }
        return (
            <div>
                <div >
                    <Navigation userName={userName} role={"user"} />
                </div> 
                    <div className="container">
                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: "cyan" }}>
                            <h5 style={{"textAlign": "center"}}>UPDATE CONTACT</h5>
                            </div>
                            <div className="card-body" style={{ backgroundColor: "grey" }}>
                                <form onSubmit={onUpdateUser}>
                                    <label  className="form-group">property To Update:</label>
                                    <input type= "text" className="form-control" value = {propertyToUpdate}
                                    onChange={(e) => updatepropertToUpdate(e.target.value)} ></input><br />
                                    <label  className="form-group">Value To be Update:</label>
                                    <input type= "text" className="form-control" value = {value}
                                    onChange={(e) => updateValue(e.target.value)} ></input><br />
                                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: "orange" }}>Update User</button><br />
                                    {StatusOfUser}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

export  default UpdateContact;