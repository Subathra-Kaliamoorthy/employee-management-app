import React, { useState, useEffect, useCallback } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Page, Toolbar, Edit } from "@syncfusion/ej2-react-grids";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import axios from "axios";
import { UserDetails } from '../interface';

const API_URL = "https://reqres.in/api/users";

const Employees = () => {
  const [userData, setUserData] = useState<UserDetails[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchData = useCallback(async (pageNumber: number) => {
    try {
      const response = await axios.get(`${API_URL}?page=${pageNumber}&per_page=5`);
      setTotalPages(response.data.total_pages);
      setUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  // CREATE
  const createUser = async (data: any) => {
    try {
      const response = await axios.post(API_URL, data);
      setUserData([...userData, { id: response.data.id, ...data }]);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // UPDATE
  const updateUser = async (data: any) => {
    try {
      await axios.put(`${API_URL}/${data.id}`, data);
      setUserData(userData.map((user) => (user.id === data.id ? data : user)));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // DELETE
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUserData(userData.filter((user: any) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="employees-content">
      <TooltipComponent id="content" cssClass="e-tooltip-template-css" target="td.infotooltip">
        <GridComponent
          dataSource={userData}
          width={'100%'}
          rowHeight={50}
          editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true }}
          toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
          actionBegin={(args) => {
            if (args.requestType === "save") {
              args.data.id ? updateUser(args.data) : createUser(args.data);
            }
            if (args.requestType === "delete") {
              deleteUser(args.data[0].id);
            }
          }}
        >
          <ColumnsDirective>
            <ColumnDirective field="id" headerText="ID" textAlign="Center" width="30" isPrimaryKey={true} />
            <ColumnDirective field="first_name" headerText="First Name" width="80" editType="stringedit" />
            <ColumnDirective field="last_name" headerText="Last Name" width="80" editType="stringedit" />
            <ColumnDirective field="email" headerText="Email" width="100" editType="stringedit" />
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, Edit]} />
        </GridComponent>
        {/* Custom Pagination */}
        <div className="paggingButton">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span style={{ padding: "0 8px" }}> Page {page} of {totalPages} </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </TooltipComponent>
    </div>
  );
};

export default Employees;
