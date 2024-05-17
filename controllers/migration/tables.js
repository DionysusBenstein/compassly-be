const created_date = `create_date date, created_time time`;

const Tables = () => {
  return {
    users: {
      createSring: `CREATE TABLE IF NOT EXISTS public.users ( id text NOT NULL, name text NOT NULL, "group" text NOT NULL, surname text, "number" text, email text NOT NULL, password text, avatar text, verify boolean NOT NULL, register_date text, creator text, PRIMARY KEY (id) );`,
    },
    biometric: {
      createSring: `CREATE TABLE IF NOT EXISTS public.biometric ( id SERIAL, user_id text NOT NULL, enabled boolean NOT NULL, device_id text, PRIMARY KEY (id) );`,
    },
    sms_verify: {
      createSring: `CREATE TABLE IF NOT EXISTS public.sms_verify ( id text NOT NULL, code text NOT NULL, user_id text NOT NULL, sms_date text NOT NULL, type text NOT NULL, active boolean NOT NULL, PRIMARY KEY (id) );`,
    },
    tokens: {
      createSring: `CREATE TABLE IF NOT EXISTS public.tokens ( id text NOT NULL, token text NOT NULL, user_id text NOT NULL, active boolean NOT NULL, ${created_date}, PRIMARY KEY (id) );`,
    },
    registers_url: {
      createSring: `CREATE TABLE IF NOT EXISTS public.registers_url ( id text NOT NULL, token text NOT NULL, user_id text NOT NULL, email text NOT NULL, active boolean NOT NULL, ${created_date}, PRIMARY KEY (id) );`,
    },
    clients: {
      createSring: `CREATE TABLE IF NOT EXISTS public.clients ( id text NOT NULL, name text NOT NULL, surname text NOT NULL, "number" text, birthday date, email text, c_firstname text, c_lastname text, c_email text, c_phone text, serevice_location text, street_address text, city text, state text, zip_code text, sex text, active boolean NOT NULL DEFAULT TRUE, ${created_date}, updated_date date, PRIMARY KEY (id) );`,
    },
    clients_doctors: {
      createSring: `CREATE TABLE IF NOT EXISTS public.clients_doctors ( id SERIAL, client_id text NOT NULL, doctor_id text NOT NULL, ${created_date}, PRIMARY KEY (id) );`,
    },
    client_domain: {
      createSring: `CREATE TABLE IF NOT EXISTS public.client_domain ( id text NOT NULL, client_id text NOT NULL, domain_id text NOT NULL, ${created_date}, updated_date date, PRIMARY KEY (id) );`,
    },
    client_maladaptives: {
      createSring: `CREATE TABLE IF NOT EXISTS public.client_maladaptives ( id text NOT NULL, client_id text NOT NULL, skill_id text NOT NULL, ${created_date}, updated_date date, PRIMARY KEY (id) );`,
    },
    client_skills: {
      createSring: `CREATE TABLE IF NOT EXISTS public.client_skills ( id text NOT NULL, client_id text NOT NULL, skill_id text NOT NULL, active boolean NOT NULL DEFAULT FALSE,  ${created_date}, PRIMARY KEY (id) );`,
    },
    domains: {
      createSring: `CREATE TABLE IF NOT EXISTS public.domains ( id text NOT NULL, title text, maladaptive boolean DEFAULT FALSE, icon text, updated_date date, ${created_date}, PRIMARY KEY (id) );`,
    },
    sub_domains: {
      createSring: `CREATE TABLE IF NOT EXISTS public.sub_domains ( id text NOT NULL, maladaptive boolean NOT NULL DEFAULT FALSE, parrent_id text NOT NULL, icon text, title text, updated_date date, rate integer NOT NULL, ${created_date}, PRIMARY KEY (id) );`,
    },
    skills: {
      createSring: `CREATE TABLE IF NOT EXISTS public.skills ( id text NOT NULL, parrent_id text NOT NULL, sub_type numeric, icon text, action_type text, title text, description text, maladaptive boolean DEFAULT FALSE, ${created_date}, updated_date date, PRIMARY KEY (id) );`,
    },
    skill_custom_type: {
      createSring: `CREATE TABLE IF NOT EXISTS public.skill_custom_type ( id SERIAL, skill_id text NOT NULL, user_id text NOT NULL, custom_sub_type numeric, custom_type text, PRIMARY KEY (id));`,
    },
    skills_data: {
      createSring: `CREATE TABLE IF NOT EXISTS public.skills_data ( id SERIAL, skill_id text NOT NULL, title text, description text, PRIMARY KEY (id) );`,
    },
    files: {
      createSring: `CREATE TABLE IF NOT EXISTS public.files ( id text NOT NULL, client_id text NOT NULL, file_name text NOT NULL, ${created_date}, updated_date date, PRIMARY KEY (id) );`,
    },
    dcm: {
      createSring: `CREATE TABLE IF NOT EXISTS public.dcm ( line_num SERIAL, id text NOT NULL, client_id text NOT NULL, skill_id text NOT NULL, doctor_id text NOT NULL, action_type text NOT NULL, time_data text, stats_value text, day integer, month integer, year integer, hour integer, minute integer, createDate date NOT NULL DEFAULT CURRENT_DATE, PRIMARY KEY (id) );`, //createDate date NOT NULL DEFAULT CURRENT_DATE
    },
    daily_planner: {
      createSring: `CREATE TABLE IF NOT EXISTS public.daily_planner ( id text NOT NULL, client_id text NOT NULL, doctor_id text, focus text, goals text, experiental text, experiental_behavior text, social text, social_behavior text, academic_present text, academic_header text, academic_description text, cleaning_present text, cleaning_description text, session text, feeling_behavior text, reward_present text, reward_description text, behavior_review text, closer_to_goal_header text, closer_to_goal_description text, notes text, day integer, month integer, year integer, ${created_date}, PRIMARY KEY (id) );`,
    },
    daily_feeling: {
      createSring: `CREATE TABLE IF NOT EXISTS public.daily_feeling ( id SERIAL, daily_id text NOT NULL, value text NOT NULL, PRIMARY KEY (id) );`,
    },
    feedbacks: {
      createSring: `CREATE TABLE IF NOT EXISTS public.feedbacks ( id text NOT NULL, user_id text NOT NULL, email text  NOT NULL, message text  NOT NULL, createDate date NOT NULL DEFAULT CURRENT_DATE,  PRIMARY KEY (id) );`,
    },
    user_groups: {
      createSring: `CREATE TABLE IF NOT EXISTS public.user_groups ( id text NOT NULL, title text NOT NULL, level numeric NOT NULL, program_library boolean NOT NULL, maladaptive boolean NOT NULL, employees boolean NOT NULL, clients boolean NOT NULL, reports boolean NOT NULL, createDate date NOT NULL DEFAULT CURRENT_DATE,  PRIMARY KEY (id) );`,
    },
    calendar: {
      createSring: `CREATE TABLE IF NOT EXISTS public.calendar ( id SERIAL, title text NOT NULL, client_id text NOT NULL, type text NOT NULL, link text, description text, startdate timestamp  NOT NULL, enddate timestamp  NOT NULL, starttime time NOT NULL, endtime time NOT NULL, author text NOT NULL, PRIMARY KEY (id) );`,
    },
    materials: {
      createSring: `CREATE TABLE IF NOT EXISTS public.materials ( id SERIAL, title text NOT NULL, type text NOT NULL, link text, format text, size integer, ${created_date}, updated_date date, PRIMARY KEY (id) );`,
    },
    materials_users: {
      createSring: `CREATE TABLE IF NOT EXISTS public.materials_users ( id SERIAL, client_id text NOT NULL, material_id integer NOT NULL, ${created_date}, PRIMARY KEY (id) );`,
    },
    materials_name: {
      createSring: `CREATE TABLE IF NOT EXISTS public.materials_name ( id SERIAL, material_id integer NOT NULL, originalname text NOT NULL, ${created_date}, updated_date date, PRIMARY KEY (id) );`,
    },
    company_materials: {
      createSring: `CREATE TABLE IF NOT EXISTS public.company_materials ( id SERIAL, title text NOT NULL, link text, client_id text NOT NULL, ${created_date}, updated_date date, PRIMARY KEY (id) );`,
    },
    company_materials_users: {
      createSring: `CREATE TABLE IF NOT EXISTS public.company_materials_users ( id SERIAL, user_id text NOT NULL, company_material_id integer NOT NULL, ${created_date}, PRIMARY KEY (id) );`,
    },
  };
};

module.exports = Tables;
