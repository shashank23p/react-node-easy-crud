import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  LinearProgress,
  Button,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import postData from "./EasyCrudNetworking";
export default function EasyCrudForm(props) {
  const [formData, setFormData] = useState();
  const [formStrc, setFormStrc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submiting, setSubmiting] = useState(false);

  useEffect(() => {
    if (props.url) {
      getForm(props.url);
    }
  }, [props.url]); // eslint-disable-line react-hooks/exhaustive-deps

  const fromSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmiting(true);
    const response = await postData(props.submitUrl, {
      headers: props.headers,
      payload: JSON.stringify(formData),
      method: "post",
    });
    const jsonRes = await response.json();
    console.log(jsonRes);
    setError(jsonRes.error);
    setMessage(jsonRes.message);
    setSubmiting(false);
    if (props.onSubmit) {
      props.onSubmit(jsonRes);
    }
  };

  const getForm = async (url) => {
    setLoading(true);
    setError("");
    try {
      const response = await postData(url, {
        headers: props.headers,
      });
      const jsonRes = await response.json();
      if (jsonRes.error) {
        setError(jsonRes.error);
        setLoading(false);
        return;
      }
      setFormStrc(jsonRes.formStrc);
      let fd = {};
      jsonRes.formStrc.forEach((element) => {
        fd[element.name] = element.value;
      });
      setFormData(fd);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      {loading ? (
        <LinearProgress />
      ) : (
        <form action="" onSubmit={(e) => fromSubmit(e)}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {formStrc.map((field) => {
            return (
              <FormControl
                style={{ minWidth: "100%", marginTop: "10px" }}
                key={field.name}
                margin="normal"
              >
                <InputLabel
                  required={field.required}
                  shrink={field.type === "date" ? true : undefined}
                >
                  {field.name}
                </InputLabel>
                {field.tag === "select" ? (
                  <Select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.name]: e.target.value,
                      })
                    }
                    disabled={field.disabled}
                    required={field.required}
                  >
                    <MenuItem value="" key="emptySelect">
                      None
                    </MenuItem>
                    {field.options.map((option) => {
                      return (
                        <MenuItem value={option.value} key={option.value}>
                          {option.text}
                        </MenuItem>
                      );
                    })}
                  </Select>
                ) : (
                  <Input
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.name]: e.target.value,
                      })
                    }
                    disabled={field.disabled}
                    required={field.required}
                    type={field.type}
                  />
                )}
              </FormControl>
            );
          })}
          {message ? <Alert severity="success">{message}</Alert> : null}
          <FormControl margin="normal">
            <Button type="submit" variant="contained" color="primary">
              {submiting ? "Loading..." : "Submit"}
            </Button>
          </FormControl>
        </form>
      )}
    </div>
  );
}
