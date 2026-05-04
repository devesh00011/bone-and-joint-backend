import cloudinary from "../../config/cloudinary.js";
import pool from "../../config/pgDb.js";

export const saveDoctorService = async (doctorData) => {
  try {
    const {
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
    } = doctorData;

    const query = `
      INSERT INTO doctors (
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
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
      )
      RETURNING *;
    `;

    const values = [
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
    ];

    const result = await pool.query(query, values);

    return result.rows[0];

  } catch (error) {
    console.log("Service error:", error);
    throw error;
  }
};

export const viewDoctorBySlugService = async (slug) => {
  try {
    const result = await pool.query(`
      SELECT * FROM doctors
      WHERE slug = $1,
      `, [slug])

    return result;
  } catch (error) {
    console.log('Server Error :', error)
    throw error;
  }
}

export const deleteDoctorService = async (id) => {
  try {
    const response = await pool.query(`
          DELETE FROM doctors 
          WHERE id = $1
        `, [id])

    return response
  } catch (error) {
    console.log(error.message)
  }
}

export const viewDoctorByIdService = async (docId) => {
  try {
    const respnose = await pool.query(`
        SELECT * from doctors 
        WHERE id = $1
        `, [docId])

    return respnose.rows[0]
  } catch (error) {
    console.log(error)
  }
}

export const updateDoctorService = async (req) => {
  try {
    const { docId } = req.params;
    const formDataObj = { ...req.body };

    const other_servicesOrg = formDataObj.other_services
      ? JSON.parse(formDataObj.other_services)
      : [];

    const is_active =
      formDataObj.is_active !== undefined
        ? formDataObj.is_active === "true" || formDataObj.is_active === true
        : true;

    const is_featured =
      formDataObj.is_featured !== undefined
        ? formDataObj.is_featured === "true" || formDataObj.is_featured === true
        : true;

    // 1. Get existing doctor (IMPORTANT for keeping old image)
    const existingDoctor = await pool.query(
      `SELECT profile_image FROM doctors WHERE id = $1`,
      [docId]
    );

    let profile_image = existingDoctor.rows[0]?.profile_image || null;

    // 2. If new file uploaded
    if (req.file) {
      // delete old image only if exists
      if (existingDoctor.rows[0]?.profile_image) {
        try {
          const publicId = existingDoctor.rows[0].profile_image
            .split("/")
            .slice(-1)[0]
            .split(".")[0];

          await cloudinary.uploader.destroy(`doctors/${publicId}`);
        } catch (err) {
          console.log("Cloudinary delete error:", err);
        }
      }

      // upload new image
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "doctors" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profile_image = uploadResult.secure_url;
    }

    // 3. Update query
    const result = await pool.query(
      `
      UPDATE doctors 
      SET 
        name = $1,
        slug = $2,
        post_name = $3,
        primary_specialization = $4,
        experience_year = $5,
        phone_number = $6,
        email = $7,
        profile_image = $8,
        short_description = $9,
        full_bio = $10,
        is_active = $11,
        is_featured = $12,
        other_services = $13,
        meta_title = $14,
        meta_description = $15,
        updated_at = NOW()
      WHERE id = $16
      RETURNING *
      `,
      [
        formDataObj.name,
        formDataObj.slug,
        formDataObj.post_name,
        formDataObj.primary_specialization,
        formDataObj.experience_year,
        formDataObj.phone_number,
        formDataObj.email,
        profile_image,
        formDataObj.short_description,
        formDataObj.full_bio,
        is_active,
        is_featured,
        other_servicesOrg,
        formDataObj.meta_title,
        formDataObj.meta_description,
        docId,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.log("updateDoctorService error:", error);
    throw error;
  }
};