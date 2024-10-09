import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { checkAuth } from "@/utils/auth";
import { useState } from "react";

const AddCar = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  const onSubmit = async (data) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const formData = new FormData();
    formData.append("model", data.model);
    formData.append("price", data.price);
    formData.append("phone", data.phone);
    formData.append("city", data.city);
    formData.append("brand", data.brand);
    formData.append("year", data.year);
    images.forEach((image) => {
      formData.append("pictures", image);
    });

    setLoading(true); // Set loading state to true
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cars/add`,
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Car added successfully");
      router.push("/");
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Failed to add car");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length <= 4) {
      setImages(selectedFiles);
    } else {
      alert("You can upload a maximum of 4 images.");
    }
  };

  return (
    <Container className="py-10" maxWidth="sm">
      <Typography variant="h4">Add Car</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("brand", {
            required: "Brand is required",
            minLength: {
              value: 3,
              message: "Brand must be at least 3 characters",
            },
            maxLength: {
              value: 30,
              message: "Brand cannot exceed 30 characters",
            },
          })}
          fullWidth
          margin="normal"
          label="Brand"
          error={!!errors.brand}
          helperText={errors.brand ? errors.brand.message : ""}
        />
        <TextField
          {...register("model", {
            required: "Model is required",
            minLength: {
              value: 3,
              message: "Model must be at least 3 characters",
            },
            maxLength: {
              value: 30,
              message: "Model cannot exceed 30 characters",
            },
          })}
          fullWidth
          margin="normal"
          label="Model"
          error={!!errors.model}
          helperText={errors.model ? errors.model.message : ""}
        />
        <TextField
          {...register("year", { required: "Year is required" })}
          fullWidth
          margin="normal"
          label="Year"
          type="number"
          error={!!errors.year}
          helperText={errors.year ? errors.year.message : ""}
        />
        <TextField
          {...register("price", { required: "Price is required" })}
          fullWidth
          margin="normal"
          label="Price"
          type="number"
          error={!!errors.price}
          helperText={errors.price ? errors.price.message : ""}
        />
        <TextField
          {...register("phone", {
            required: "Phone number is required",
            minLength: {
              value: 11,
              message: "Phone number must be at least 11 digits",
            },
            maxLength: {
              value: 15,
              message: "Phone number cannot exceed 15 digits",
            },
            pattern: {
              value: /^\d+$/,
              message: "Phone number must be numeric",
            },
          })}
          fullWidth
          margin="normal"
          label="Phone"
          error={!!errors.phone}
          helperText={errors.phone ? errors.phone.message : ""}
        />
        <TextField
          {...register("city", { required: "City is required" })}
          fullWidth
          margin="normal"
          label="City"
          select
          SelectProps={{
            native: true,
          }}
        >
          <option value="Karachi">Karachi</option>
          <option value="Lahore">Lahore</option>
          <option value="Islamabad">Islamabad</option>
        </TextField>
        <TextField
          type="file"
          inputProps={{ accept: "image/*", multiple: true }}
          onChange={handleImageChange}
          fullWidth
          margin="normal"
          required // Make the file input required
        />

        {images.length > 0 && (
          <div className="my-5">
            <Typography variant="body2">Selected Images:</Typography>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)} // Create a URL for the selected image
                  alt={`Selected image ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }} // Style the image
                />
              ))}
            </div>
          </div>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Car"}
        </Button>
      </form>
    </Container>
  );
};

// Server-side authentication check
export async function getServerSideProps(context) {
  const { req, res } = context;

  const isAuthenticated = checkAuth(req, res);
  if (!isAuthenticated) {
    return { props: {} };
  }

  return {
    props: {},
  };
}

export default AddCar;
