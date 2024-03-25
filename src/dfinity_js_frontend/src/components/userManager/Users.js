import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import User from "./User";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getUsers as getUserList,
  createUser,
  updateUser,
} from "../../utils/userManager";
import Header from "../utils/Header";
import { createAsset } from "../../utils/assetManager";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of users
  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setUsers(await getUserList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addUser = async (data) => {
    try {
      setLoading(true);
      createUser(data).then((resp) => {
        getUsers();
      });
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (data) => {
    try {
      setLoading(true);
      const maxSlotsStr = data.maxSlots;
      data.maxSlots = parseInt(maxSlotsStr, 10) * 10 ** 8;
      createAsset(data).then((resp) => {
        toast(<NotificationSuccess text="Asset added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a asset." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      updateUser(data).then((resp) => {
        getUsers();
      });
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Header saveUser={addUser} saveAsset={addAsset} />
      {!loading ? (
        <div
          style={{ background: "#000", minHeight: "100vh" }}
          className="container"
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Users Manager</h1>
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {users.map((_user, index) => (
              <User
                key={index}
                user={{
                  ..._user,
                }}
                update={update}
              />
            ))}
          </Row>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Users;
