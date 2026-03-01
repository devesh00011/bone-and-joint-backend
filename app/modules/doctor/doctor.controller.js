import cloudinary from "../../config/cloudinary.js";
import pool from "../../config/pgDb.js";
import { deleteDoctorService, saveDoctorService, viewDoctorBySlugService } from "./doctor.service.js";

export const saveDoctor = async (req, res) => {
  try {
    const {
      name,
      slug,
      post_name,
      primary_specialization,
      experience_year,
      phone_number,
      email,
      short_description,
      full_bio,
      meta_title,
      meta_description
    } = req.body;

    let profile_image = null
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "doctors" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profile_image = result.secure_url;
    }
    const other_services = req.body.other_services
      ? JSON.parse(req.body.other_services)
      : [];

    const is_active =
      req.body.is_active !== undefined
        ? req.body.is_active === "true" || req.body.is_active === true
        : true;

    const is_featured =
      req.body.is_featured !== undefined
        ? req.body.is_featured === "true" || req.body.is_featured === true
        : true;

    const doctorData = {
      name,
      slug,
      post_name,
      primary_specialization,
      experience_year,
      phone_number,
      email,
      profile_image,
      short_description,
      full_bio,
      is_active,
      is_featured,
      other_services,
      meta_title,
      meta_description
    };

    const response = await saveDoctorService(doctorData);
    console.log(response)

    return res.status(200).json({
      success: true,
      msg: 'Doctor Added Successfully !'
    });

  } catch (error) {
    console.log("save doctor error", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save doctor",
    });
  }

};

export const viewDoctor = async (req, res) => {
  try {
    const response = await pool.query(`
        SELECT * FROM doctors
      `)

    const doctors = response.rows

    if (doctors.length == 0) {
      return res.status(200).json({
        success: true,
        msg: 'No Doctor Found',
        response: []
      })
    }

    return res.status(200).json({
      success: true,
      msg: 'All Active Doctors',
      response: doctors
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to view doctor",
    });
  }
};

export const viewDoctorBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const result = await viewDoctorBySlugService(slug)
    console.log(result)

    return res.status(200).json({
      success: true,
      msg: 'slug wise doctor data',
      result
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to find doctor by slug'
    })
  }
}

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params
    const result = await deleteDoctorService(id)
    if (!result) return res.status(404).json({
      success: false,
      msg: 'Cannot delete doctor'
    })
    res.status(200).json({
      success: true,
      msg: 'Doctor deleted successfully'
    })
    console.log(result)
  } catch (error) {
    console.log(error.message || 'Server issue')
    return res.status(500).json({
      success: true,
      msg: 'Server issue'
    })
  }
}