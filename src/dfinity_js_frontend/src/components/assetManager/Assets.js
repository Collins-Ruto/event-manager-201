import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Asset from "./Asset";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getAssets as getAssetList,
  createAsset,
  buyAsset,
  updateAsset,
} from "../../utils/assetManager";
import Header from "../utils/Header";
import { createUser } from "../../utils/userManager";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of assets
  const getAssets = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setAssets(await getAssetList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addAsset = async (data) => {
    console.log("adder");
    try {
      setLoading(true);
      data.availableUnits = parseInt(data.availableUnits, 10);
      data.pricePerUnit = parseInt(data.pricePerUnit, 10) * 10 ** 8;
      createAsset(data).then((resp) => {
        console.log(resp);
        getAssets();
        toast(<NotificationSuccess text="Asset added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a asset." />);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (data) => {
    try {
      setLoading(true);
      createUser(data).then((resp) => {});
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to buy book
  const buy = async (asset, units) => {
    try {
      setLoading(true);
      console.log({ asset, units });
      buyAsset(asset, units).then((resp) => {
        getAssets();
        toast(
          <NotificationSuccess text="Asset buy successfully, check users tab for your assets" />
        );
      });
    } catch (error) {
      toast(<NotificationError text="Failed to buy asset." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      data.pricePerUnit = parseInt(data.pricePerUnit, 10) * 10 ** 8;
      updateAsset(data).then((resp) => {
        getAssets();
        toast(<NotificationSuccess text="Asset added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a asset." />);
    } finally {
      setLoading(false);
    }
  };

  console.log(assets);

  useEffect(() => {
    getAssets();
  }, []);

  return (
    <>
      <Header saveAsset={addAsset} saveUser={addUser} />
      {!loading ? (
        <div
          style={{ background: "#000", minHeight: "100vh" }}
          className="container"
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Assets</h1>
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {assets.map((_asset, index) => (
              <Asset
                key={index}
                asset={{
                  ..._asset,
                }}
                buy={buy}
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

export default Assets;
