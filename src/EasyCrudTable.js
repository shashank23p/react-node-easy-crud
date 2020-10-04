import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import {
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import EasyCrudModal from "./EasyCrudModal";
import EasyCrudForm from "./EasyCrudForm";
import postData from "./EasyCrudNetworking";
const EasyCrudTable = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [header, setHeader] = useState([]);
  const [edit, setEdit] = useState(true);
  const [editId, setEditId] = useState(null);
  const [del, setDel] = useState(true);
  const [delId, setDelId] = useState(null);
  const [add, setAdd] = useState(true);
  const [title, setTitle] = useState("");
  const [idField, setIdField] = useState("_id");
  const [editModelOpen, setEditModelOpen] = useState(false);
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteing, setDeleting] = useState(false);
  const [error, setError] = useState("");

  //global consts
  const editFromRoute = "/edit-form/";
  const updateRoute = "/update/";
  const addFromRoute = "/add-form/";
  const insertRoute = "/insert/";
  const deleteRoute = "/delete";

  useEffect(() => {
    getdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const editToggal = () => {
    setEditModelOpen(!editModelOpen);
  };
  const addToggal = () => {
    setAddModelOpen(!addModelOpen);
  };
  const delToggal = () => {
    setDeleteDialogOpen(!deleteDialogOpen);
  };
  const editRow = (id = null) => {
    setEditId(id);
    editToggal();
  };
  const openDelDailog = (id = null) => {
    setDelId(id);
    delToggal();
  };
  const addRow = () => {
    addToggal();
  };
  const onSubmit = () => {
    getdata();
  };

  const deleteRow = async () => {
    setDeleting(true);
    setError("");
    try {
      const payload = { id: delId };
      const response = await postData(props.url + deleteRoute, {
        headers: props.headers,
        method: "post",
        payload: JSON.stringify(payload),
      });
      const jsonRes = await response.json();
      if (jsonRes.error) {
        setError(jsonRes.error);
        console.error(jsonRes.error);
        setDeleting(false);
        return;
      }
      setDeleting(false);
      delToggal();
      getdata();
    } catch (error) {
      setError(error.message);
      setDeleting(false);
    }
  };
  const getdata = async () => {
    setLoading(true);
    try {
      const response = await postData(props.url, {
        headers: props.headers,
      });
      const jsonRes = await response.json();
      if (jsonRes.error) {
        console.error(jsonRes.error);
        return;
      }
      const tableData = jsonRes.tableData;
      setEdit(jsonRes.edit);
      setDel(jsonRes.del);
      setAdd(jsonRes.add);
      setIdField(jsonRes.idField);
      setTitle(props.title ? props.title : jsonRes.title);
      setData(tableData);
      //getting table headers form json
      let fields = Object.keys(Object.assign({}, ...tableData));
      let temHeader = [];
      fields.forEach((field) => {
        if (field !== idField)
          temHeader.push({
            title: field.charAt(0).toUpperCase() + field.slice(1),
            field: field,
          });
      });
      setHeader(temHeader);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      {/* edit model */}
      <EasyCrudModal
        open={editModelOpen}
        handleClose={editToggal}
        title={"Edit " + title}
      >
        <EasyCrudForm
          url={props.url + editFromRoute + editId}
          headers={props.headers}
          submitUrl={props.url + updateRoute}
          onSubmit={onSubmit}
        ></EasyCrudForm>
      </EasyCrudModal>

      <EasyCrudModal
        open={addModelOpen}
        handleClose={addToggal}
        title={"Add " + title}
      >
        <EasyCrudForm
          url={props.url + addFromRoute}
          headers={props.headers}
          submitUrl={props.url + insertRoute}
          onSubmit={onSubmit}
        ></EasyCrudForm>
      </EasyCrudModal>

      <Dialog open={deleteDialogOpen} onClose={delToggal}>
        <DialogTitle id="alert-dialog-title">{"Delete " + title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"Do you really want to delete " + delId}
          </DialogContentText>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={delToggal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteRow}
            color="secondary"
            autoFocus
            disabled={deleteing}
          >
            {deleteing ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <LinearProgress />
      ) : (
        <div style={{ maxWidth: "100%" }}>
          <MaterialTable
            columns={header}
            data={data}
            title={title}
            actions={[
              edit
                ? {
                    icon: "edit",
                    tooltip: "Edit",
                    onClick: (event, rowData) => editRow(rowData[idField]),
                  }
                : null,
              del
                ? {
                    icon: "delete",
                    tooltip: "Delete",
                    onClick: (event, rowData) =>
                      openDelDailog(rowData[idField]),
                  }
                : null,
              add
                ? {
                    icon: "add",
                    tooltip: "Add",
                    isFreeAction: true,
                    onClick: (event) => addRow(),
                  }
                : null,
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default EasyCrudTable;
