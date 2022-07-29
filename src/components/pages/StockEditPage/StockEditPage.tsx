import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { FormikProps, Form, Field, Formik } from "formik";
import { TextField } from "formik-material-ui";
import * as React from "react";
import { useSelector } from "react-redux";
import { Link, useMatch } from "react-router-dom";
import { useAppDispatch } from "../../..";
import { imageUrl } from "../../../Constants";
import { RootReducers } from "../../../reducers";
import { Product } from "../../../types/product.type";
import * as stockEditActions from "./../../../actions/stock.edit.action";

const StockEditPage: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const stockEditReducer = useSelector((state: RootReducers) => state.stockEditReducer);

  const match = useMatch("/stock/edit/:id");
  React.useEffect(() => {
    let id = match?.params.id;
    dispatch(stockEditActions.getProductById(id));
  }, []);

  const showPreviewImage = (values: any) => {
    if (values.file_obj) {
      return <img src={values.file_obj} style={{ height: 150 }} alt="preview" />;
    } else if (values.image) {
      return (
        <img
          src={`${imageUrl}/images/${values.image}`}
          style={{ height: 150 }}
          alt="preview"
        />
      );
    }
  };

  const showForm = ({
    values,
    setFieldValue,
    isSubmitting,
  }: FormikProps<Product>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              Edit Stock
            </Typography>

            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="name"
              type="text"
              label="Name"
            />
            <br />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="price"
              type="number"
              label="Price"
            />

            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="stock"
              type="number"
              label="Stock"
            />

            <div style={{ margin: 16 }}>{showPreviewImage(values)}</div>

            <div>
              <img
                src={`${process.env.PUBLIC_URL}/images/ic_photo.png`}
                style={{ width: 25, height: 20 }}
                alt="preview"
              />
              <span style={{ color: "#00B0CD", marginLeft: 10 }}>
                Add Picture
              </span>

              <input
                type="file"
                onChange={(e: React.ChangeEvent<any>) => {
                  e.preventDefault();
                  setFieldValue("file", e.target.files[0]); // for upload
                  setFieldValue(
                    "file_obj",
                    URL.createObjectURL(e.target.files[0])
                  ); // for preview image
                }}
                name="image"
                click-type="type1"
                multiple
                accept="image/*"
                id="files"
                style={{ padding: "20px 0 0 20px" }}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button
              disabled={isSubmitting}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginRight: 1 }}
            >
              Edit
            </Button>
            <Button component={Link} to="/stock" variant="outlined" fullWidth>
              Cancl
            </Button>
          </CardActions>
        </Card>
      </Form>
    );
  };

  const initialValues: Product = { name: "Loading...", stock: 0, price: 0 };

  return (
    <Box>
      <Formik
        validate={(values) => {
          let errors: any = {};
          if (!values.name) errors.name = "Enter name";
          if (values.stock < 10)
            errors.stock = "Min stock is not lower than 10";
          if (values.price < 100)
            errors.price = "Min price is not lower than 100";
          return errors;
        }}
        enableReinitialize
        initialValues={
          stockEditReducer.result ? stockEditReducer.result : initialValues
        }
        onSubmit={(values, { setSubmitting }) => {
          // alert(JSON.stringify(values));
          let formData = new FormData();
          formData.append("id", String(values.id));
          formData.append("name", values.name);
          formData.append("price", String(values.price));
          formData.append("stock", String(values.stock));

          if (values.file) {
            formData.append("image", values.file);
          }

          dispatch(stockEditActions.updateProduct(formData));
          setSubmitting(false);
        }}
      >
        {(props: any) => showForm(props)}
      </Formik>
    </Box>
  );
};

export default StockEditPage;
