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