
-- doctor table
CREATE TABLE IF NOT EXISTS public.doctors (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    slug character varying(150) COLLATE pg_catalog."default" NOT NULL,
    post_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    primary_specialization character varying(150) COLLATE pg_catalog."default" NOT NULL,
    experience_year integer NOT NULL DEFAULT 0,
    phone_number character varying(20) COLLATE pg_catalog."default" NOT NULL,
    email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    profile_image text COLLATE pg_catalog."default",
    short_description text COLLATE pg_catalog."default" NOT NULL,
    full_bio text COLLATE pg_catalog."default" NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    is_featured boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    other_services text[] COLLATE pg_catalog."default" DEFAULT '{}'::text[],
    meta_title character varying(150) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    meta_description character varying(150) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    CONSTRAINT doctors_pkey PRIMARY KEY (id)
)

--service table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    service_name VARCHAR(150) NOT NULL,
    service_slug VARCHAR(150) UNIQUE NOT NULL,

    short_description TEXT,
    full_details TEXT,

    service_image TEXT,

    meta_title VARCHAR(200),
    meta_description TEXT,

    key_benefits TEXT[],
    commonly_used TEXT[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL,
	appointment_day character varying(50),
    patient_name VARCHAR(150),
    patient_phone VARCHAR(20),
    patient_email VARCHAR(150),
    payment_method VARCHAR(150),
    payment_proof_image TEXT,
	
    CONSTRAINT fk_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name character varying(150),
    email_id character varying(150),
    phone_number character varying(20),
    user_message character varying(300),
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
)

-- blog category table
CREATE TABLE IF NOT EXISTS blog_category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name character varying(150) NOT NULL,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
)


-- blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    blog_title VARCHAR(200) NOT NULL,
    blog_slug VARCHAR(200) UNIQUE NOT NULL,

    blog_full_description TEXT,

    blog_image TEXT,

    blog_author_name VARCHAR(150),

    blog_read_time INT, -- in minutes (e.g. 5 min read)

    blog_category_id UUID,

    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    meta_title VARCHAR(200),
    meta_description VARCHAR(200),

    FOREIGN KEY (blog_category_id) REFERENCES blog_category(id) ON DELETE SET NULL
);



CREATE TABLE blog_sections (
    id SERIAL PRIMARY KEY,
    blog_id UUID NOT NULL,  

    section_title TEXT,
    section_short_description TEXT,
    section_full_description TEXT,
    section_image TEXT,
    sub_content JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_blog
        FOREIGN KEY(blog_id)
        REFERENCES blogs(id)
        ON DELETE CASCADE
);
