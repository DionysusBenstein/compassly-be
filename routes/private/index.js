const prefix = "admin";
const express = require(`express`),
  { verifyToken } = require("../../middleware"),
  multer = require("multer"),
  router = express.Router(),
  mime = require("mime-types"),
  path = require("path"),
  fs = require("fs"),
  AddNewDoctor = require("./_add-new-doctor"),
  Login = require("./_login"),
  Logout = require("./_logout"),
  GetData = require("./_get-data"),
  DeleteData = require("./_delete-data"),
  UpdateData = require("./_update-data"),
  SetData = require("./_set-data"),
  ResetPassword = require("./_reset-password"),
  ImportDomainsByFile = require("./_import-domains"),
  CheckSession = require("./_check-session"),
  Therapists = require("./_therapists"),
  NewPassword = require("./_new-password"),
  GetMaterials = require("./_materials"),
  UploadMaterial = require("./_material"),
  UpdateMaterial = require("./_update-material"),
  GetProgram = require("./_get-program"),
  GetDomains = require("./_get-domains"),
  GetMalataptives = require("./_get-maladaptives"),
  CreateProgram = require("./_create-program"),
  GetProgramMal = require("./_get-program-mal"),
  CreateProgramMal = require("./_set-program-mal"),
  GetDoctors = require("./_doctors"),
  GetClients = require("./_clients"),
  GetClient = require("./_client"),
  CreateClient = require("./_add-clients"),
  UpdateClient = require("./_update-client"),
  DeleteClient = require("./_delete-client"),
  DeactiveClient = require("./_deactive-client"),
  ActiveClient = require("./_active-client"),
  GetDomainList = require("./_get-domains-list"),
  GetDomainIcons = require("./_get-domains-icons"),
  GetSubDomains = require("./_get-subdomains"),
  GetSkills = require("./_get-skills"),
  GetMaladaptive = require("./_maladaptive"),
  AddMaladaptive = require("./_add-maladaptive"),
  UpMaladaptive = require("./_up-maladaptive"),
  GetReport = require("./_report"),
  GetNewReport = require("./_new-report"),
  ReportSubdomains = require("./_report-subdomains"),
  GetMaladaptiveDomains = require("./_get-maladaptive-domains"),
  Activation = require("./_activation"),
  GetActiveUser = require("./_get-active-user"),
  DeleteDomain = require("./_delete-domain"),
  DeleteSubDomain = require("./_delete-sub-domain"),
  DeleteSkill = require("./_delete-skill"),
  ImportEmployeees = require("./_import-employees"),
  ImportClients = require("./_import-clients"),
  ImportMaladaptives = require("./_import-maladaptives"),
  UpMalIcon = require("./_update-maladaptive-icon"),
  GetPlanners = require("./_get-planners"),
  GetConfigDomain = require("./_get-config"),
  UpConfigDomain = require("./_update-config"),
  SetSkillData = require("./_set-skill-data"),
  NewProgramClient = require("./_create-and-assyne-domain"),
  NewMaladaptiveClient = require("./_create-and-assyne-maladaptive"),
  AddCustomType = require("./_add-custom-type"),
  DeleteCustomType = require("./_delete-custom-type");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      const assets = path.join(__dirname, `../../assets`);
      const materials = path.join(__dirname, `../../assets`) + `/materials`;

      if (!fs.existsSync(assets)) fs.mkdirSync(assets);
      if (!fs.existsSync(materials)) fs.mkdirSync(materials);

      callback(null, `./assets/materials`);
    },
    filename: function (req, file, cb) {
      // const ext = mime.extension(file.mimetype);
      cb(null, file.originalname);
    },
  }),
  upload = multer({ storage: storage });

router.get(`/${prefix}/activate/:token`, Activation); //Activation account
router.get(`/${prefix}/active-user/:id`, GetActiveUser); //Activation account

router.get(`/${prefix}/check-session`, CheckSession); //Auth by email and password

router.post(`/${prefix}/add-new-doctor`, verifyToken, AddNewDoctor); //add new doctor invite

router.post(`/${prefix}/login`, Login); //Auth by email and password
router.post(`/${prefix}/forgot-password`, ResetPassword); //Forgot password
router.get(`/${prefix}/logout`, verifyToken, Logout); //Auth by email and password

router.get(`/${prefix}/data*`, verifyToken, GetData); //get data by table
router.delete(`/${prefix}/data/:table/:id`, verifyToken, DeleteData); //delete data by table
router.put(`/${prefix}/data/:table/:id`, verifyToken, UpdateData); //update data by table
router.post(`/${prefix}/data/:table`, verifyToken, SetData); //set data by table

router.get(`/${prefix}/materials*`, verifyToken, GetMaterials); //Get materials list
router.post(
  `/${prefix}/material/:client_id`,
  [upload.array("files"), verifyToken],
  UploadMaterial
); //set new material
router.put(`/${prefix}/material/:id/:client_id`, verifyToken, UpdateMaterial); //update material

router.post(`/${prefix}/import-domains`, verifyToken, ImportDomainsByFile); //set data by table
router.get(`/${prefix}/domains/:client_id`, verifyToken, GetDomains);
router.get(`/${prefix}/maladaptives/:client_id`, verifyToken, GetMalataptives);
router.get(`/${prefix}/therapists`, verifyToken, Therapists); //set data by table

router.put(`/${prefix}/new-password`, verifyToken, NewPassword); //update data by table

router.get(`/${prefix}/program/:client_id*`, verifyToken, GetProgram);
router.post(`/${prefix}/program/:client_id`, verifyToken, CreateProgram);

router.get(`/${prefix}/program-mal/:client_id*`, verifyToken, GetProgramMal);
router.post(`/${prefix}/program-mal/:client_id`, verifyToken, CreateProgramMal);

router.get(`/${prefix}/doctors`, verifyToken, GetDoctors);

/** DELETES */
router.delete(`/${prefix}/delete-domain/:id`, verifyToken, DeleteDomain);
router.delete(`/${prefix}/delete-subdomain/:id`, verifyToken, DeleteSubDomain);
router.delete(`/${prefix}/delete-skill/:id`, verifyToken, DeleteSkill);

/** CLIENTS */
const clients = [`/${prefix}/clients`, `/${prefix}/clients/:doctor_id`];
router.get(clients, verifyToken, GetClients);
router.get(`/${prefix}/client/:id`, verifyToken, GetClient);
router.post(`/${prefix}/add-client`, verifyToken, CreateClient);
router.put(`/${prefix}/update-client/:id`, verifyToken, UpdateClient);
router.delete(`/${prefix}/delete-client/:id`, verifyToken, DeleteClient);
router.put(`/${prefix}/deactivate-client/:id`, verifyToken, DeactiveClient);
router.put(`/${prefix}/activate-client/:id`, verifyToken, ActiveClient);
router.get(`/${prefix}/planner/:client_id`, verifyToken, GetPlanners);

router.get(`/${prefix}/domains-list/:client_id`, verifyToken, GetDomainList);
router.get(`/${prefix}/subdomains/:domain_id`, verifyToken, GetSubDomains);
const _SKILLS = [`/${prefix}/skills`, `/${prefix}/skills/:subdomain_id`];
router.get(_SKILLS, verifyToken, GetSkills);

router.post(`/${prefix}/skill-data/:skill_id`, verifyToken, SetSkillData);

router.get(`/${prefix}/maladaptive*`, verifyToken, GetMaladaptive);
router.post(`/${prefix}/maladaptive`, verifyToken, AddMaladaptive);
router.put(`/${prefix}/maladaptive/:id`, verifyToken, UpMaladaptive);
router.get(`/${prefix}/mal-dom/:id`, verifyToken, GetMaladaptiveDomains);
router.post(`/${prefix}/maladaptive-icon`, verifyToken, UpMalIcon);

router.post(`/${prefix}/report`, GetReport);
router.post(`/${prefix}/new-report`, GetNewReport);
router.post(`/${prefix}/report-subdomains`, verifyToken, ReportSubdomains);

router.post(`/${prefix}/import-employees`, verifyToken, ImportEmployeees);
router.post(`/${prefix}/import-clients`, verifyToken, ImportClients);
router.post(`/${prefix}/import-maladaptive`, verifyToken, ImportMaladaptives);

router.get(
  `/${prefix}/config/:domain_id/:client_id`,
  verifyToken,
  GetConfigDomain
);

router.put(
  `/${prefix}/config/:skill_id/:client_id`,
  verifyToken,
  UpConfigDomain
);

router.post(`/${prefix}/new-program`, verifyToken, NewProgramClient);
router.post(`/${prefix}/new-maladaptive`, verifyToken, NewMaladaptiveClient);

const { getDomains, getSubDomains, getSkills } = require("./list");

const _DOMAINS = [`/${prefix}/list/domains*`];
router.get(_DOMAINS, verifyToken, getDomains);

router.get(`/${prefix}/export/icons`, verifyToken, GetDomainIcons);

const _SUBDOMAINS = [`/${prefix}/list/subdomains*`];
router.get(_SUBDOMAINS, verifyToken, getSubDomains);
router.get(`/${prefix}/list/skills*`, verifyToken, getSkills);

const PasswordValidation = require("./_password-validation");
router.post(`/${prefix}/password-validation`, verifyToken, PasswordValidation);

const GetDemoFile = require("./_get-demo-file");
router.get(`/${prefix}/get-demo-file/:type`, GetDemoFile);

/** Custom types */
router.post(`/${prefix}/c-type/:s_id/:c_id`, verifyToken, AddCustomType);
router.delete(`/${prefix}/c-type/:s_id/:c_id`, verifyToken, DeleteCustomType);

// router.post(`/${prefix}/import-domains`, verifyToken, ImportDomainsByFile); //set data by table

router.get(`/hello`, (req, res) => {
  res.status(200).send("Hello World!");
});
module.exports = router;
