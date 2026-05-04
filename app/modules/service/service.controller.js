import pool from "../../config/pgDb.js"
import { addServiceService, createServiceVideos, deleteServiceByIdService, updateServiceByIdService, UpdateServicesVideosService, viewServiceByIdService } from "./service.service.js"

export const addService = async (req, res) => {
    try {
        const result = await addServiceService(req)
        if (!result) return res.status(400).json({
            success: false,
            msg: 'Cannot add service'
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'Service added Successfully !'
            })
        }
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: "Server Error"
        })
    }
}

export const viewService = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                    s.*, 
                    sv.service_video, 
                    sv.service_testimonials
                FROM services s
                LEFT JOIN service_videos sv 
                    ON s.id = sv.service_id
                ORDER BY s.created_at DESC;
                            `)

        const services = result.rows

        if (!services) return res.status(404).json({
            success: false,
            msg: 'Cannot found Services'
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'All Services data',
                response: services
            })
        }
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const viewServiceById = async (req, res) => {
    try {
        const { id } = req.params
        const services = await viewServiceByIdService(id)
        if (!services) {
            return res.status(404).json({
                success: false,
                msg: 'Services not found'
            })
        }
        else {
            return res.status(200).json({
                success: true,
                msg: 'Services Data By id',
                services
            })
        }

    } catch (error) {
        console.log(error || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const updateServiceById = async (req, res) => {
    try {
        const response = await updateServiceByIdService(req)
        res.send({
            success: true,
            msg: 'Service Updated Successfully !',
        })
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params
        const response = await deleteServiceByIdService(id)
        if (!response) return res.status(404).json({
            success: false,
            msg: 'Cannot delete service by id '
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'Service Deleted Successfully !'
            })
        }
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const addServicesVideos = async (req, res) => {
    try {
        const result = await createServiceVideos(req);

        if (!result || result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                msg: 'Service Not Found'
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Service Videos Created Successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error.message || error);

        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
};

export const getServiceDatabyId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT * FROM service_videos
            WHERE service_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'Cannot find any Data'
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Specific Service Data',
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error.message || error);

        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
};

export const UpdateServicesVideos = async (req, res) => {
    try {
        const result = await UpdateServicesVideosService(req);

        if (!result || result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                msg: 'Service Not Found'
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Videos Updated Successfully',
        });

    } catch (error) {
        console.log(error.message || error);

        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
};