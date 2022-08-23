import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../navigation/navigation";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";


function AllUsers() {
    const User = useParams().userName
    const [allUsers, updateallUsers] = useState({});
    const [pageNumber, updatePageNumber] = useState(1);
    const [limit, updateLimit] = useState(5);
    const [loginStatus, updateloginStatus] = useState(false)
    const [allUserCount, updateallUserCount] = useState(0);
    let navigate = new useNavigate();
    const navToLogin = () => {
      navigate('/');
    };
    
    const toggleUser = (e) => {
      let userId = e.target.id;
      axios
        .post("http://localhost:8082/api/v1/deleteUser", { userId })
        .then((resp) => {
          updateallUsers(resp.data);
        })
        .catch((error) => {});
    };

    function getNumberOfUser() {
      axios
        .get("http://localhost:8082/api/v1/numberOfUsers")
        .then((resp) => {
          updateallUserCount(parseInt(resp.data));
        })
        .catch((error) => {});
    }

    useEffect(() => {
      axios.post("http://localhost:8082/api/v1/isAdminLogin",{})
        .then((resp) => {
          updateloginStatus(true);
        })
        .catch((error) => {
          updateloginStatus(false);
        });
        getUser();
        getNumberOfUser();
    }, [pageNumber, limit, allUsers]);
  
    function getUser(){
      axios
        .post("http://localhost:8082/api/v1/getUser", { limit, pageNumber })
        .then((resp) => {
          updateallUsers(resp.data);
          updateloginStatus(true);
        })
        .catch((error) => {
        });
      }
    
    let rowOfUser;

    if (allUsers != null) {
      let index=0;
        rowOfUser = Object.values(allUsers).map((u) => {
          index+=1;
            return (
              
              <tr id={u.userId} style ={{background : "grey"}}>
                <td>{index}</td>
                <td>{u.credential.userName}</td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td>{u.role}</td>
                <td id={u.UserId}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={u.isActive}
                          onChange={toggleUser}
                          id={u.UserId}
                        />
                      }
                    />
                  </FormGroup>
                </td>
                <td>
                <a href={`updateUser1/${User}/${u.credential.userName}`}>
                  <button className="btn btn-primary"  style={{ backgroundColor: "green" }}>Update</button>
                  </a>
                </td>
              </tr>
            );
          });
        }
    if (!loginStatus) {
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
        );
      }
      return (
        <>
          <NavBar userName={User} role={"admin"} />
          <div>
            <div className="pagination">
              <label className="fw-bold">limit:</label>
              <select
                id="role"
                name="role"
                onChange={(e) => {
                  updateLimit(e.target.value);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="pagination">
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(allUserCount/limit)}
                  color="primary"
                  onChange={(e, value) => updatePageNumber(value)}
                />
              </Stack>
            </div>
          </div>
          <div>
            <table className ="table table-striped">
              <thead style ={{background : "orange"}}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Username</th>
                  <th scope="col">Firstname</th>
                  <th scope="col">Lastname</th>
                  <th scope="col">Role</th>
                  <th scope="col">IsActive</th>
                  <th scope="col">Update</th>
                </tr>
              </thead>
              <tbody>{rowOfUser}</tbody>
            </table>
          </div>
        </>
      );
}
export default AllUsers