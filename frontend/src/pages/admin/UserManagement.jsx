import { useFetchData } from "6pp";
import { Avatar, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import Table from "../../components/shared/Table";

import { transformImage } from "../../libs/Features";
import { useErrors } from "../../hooks/hook";
import { Server } from "../../constant/config";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];

const UserManagement = () => {
  const { loading, data, error } = useFetchData(
    `${Server}/api/v4/admin/user`,
    "dashboard-users"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data.users)) {
      // console.log("Fetched data:", data); // Log the fetched data
      // console.log("Users array:", data.users); // Log the users array

      // Log each user's name
      data.users.forEach(user => {
        // console.log("User Name:", user.name);
      });

      const transformedRows = data.users.map((i) => ({
        ...i,
        id: i._id,
        avatar: transformImage(i.avatar, 50),
      }));

      // console.log("Transformed rows:", transformedRows); // Log the transformed rows
      setRows(transformedRows);
    } else if (data) {
      // console.error("Data format is invalid. Expected an array for users, but got:", data.users);
    }
  }, [data]);

  return (
    <AdminLayout>
    {loading ? (
      <Skeleton height={"100vh"} />
    ) : (
      <Table heading={"All Users"} columns={columns} rows={rows} />
    )}
  </AdminLayout>
  );
};

export default UserManagement;
