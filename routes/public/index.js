const router = require(`express`).Router(),
  { verifyToken } = require("../../middleware"),
  Init = require("./_init"),
  Register = require("./_register"),
  Auth = require("./_auth"),
  Code = require("./_code"),
  ResendCode = require("./_resend-code"),
  Logout = require("./_logout"),
  Main = require("./_main"),
  ResetPassword = require("./_password-reset"),
  NewPassword = require("./_password-new"),
  Clients = require("./_clients"),
  Domains = require("./_domains"),
  Subdomains = require("./_sub-domains"),
  AllSubdomains = require("./_all-sub-domains"),
  Skills = require("./_skills"),
  SkillsData = require("./_skills-data"),
  AllSkills = require("./_all-skills"),
  Graph = require("./_graph"),
  Dcm = require("./_dcm"),
  ListDaily = require("./_daily-list"),
  GetDaily = require("./_daily-get"),
  SetDaily = require("./_daily-set"),
  HistoryData = require("./_history"),
  HistoryDelete = require("./_history-delete"),
  Avatar = require("./_avatar"),
  Feedback = require("./_feedback"),
  User = require("./_user"),
  Calendar = require("./_calendar"),
  Materials = require("./_materials"),
  Maladaptives = require("./_maladaptives"),
  CompanyResources = require("./_company-resources");

const GetBiometric = require("./_get-biometric");
const SetBiometric = require("./_set-biometric");
const DeleteBiometric = require("./_delete-biometric");

router.get(`/init`, Init); //Get server connect
router.post([`/auth`, `/auth/:device_id`], Auth); //Auth by emain and password
router.post(`/code`, Code); //Send validation code
router.post(`/resend-code`, ResendCode); //Resend validation code
router.post(`/register`, Register); //Register new user (doctor)
router.post(`/logout`, verifyToken, Logout); //logout session
router.post(`/reset-password`, ResetPassword); //Reset password
router.put(`/new-password`, NewPassword); //Set new password

router.get(`/main`, verifyToken, Main); //Get main
router.get(`/clients`, verifyToken, Clients); //Get clients table
router.get(`/user`, verifyToken, User); //Get server connect
router.post(`/domains`, verifyToken, Domains); //Get client domains
router.post(`/maladaptives`, verifyToken, Maladaptives); //Get client domains
router.post(`/subdomains/:field?/:sort?`, verifyToken, Subdomains); //Get subdomains
router.post(`/all/subdomains/:field?/:sort?`, verifyToken, AllSubdomains); //Get sub_domains
router.post(`/skills/data`, SkillsData); //Get skills
router.post(`/all/skills`, verifyToken, AllSkills); //Get subdomains
router.post(`/avatar/:user_id`, verifyToken, Avatar); //Set new password
router.post(`/feedback`, verifyToken, Feedback); //Set new password
// router.post(`/skills`, verifyToken, Skills); //Get skillsr

/* Daily planner */
router.get(`/list/:client_id*`, verifyToken, ListDaily);
router.post(`/get/daily`, verifyToken, GetDaily);
router.post(`/set/daily`, verifyToken, SetDaily);

/* Graph */
router.post(`/get/graph`, verifyToken, Graph);
/* use the DCM */
router.post(`/dcm/get`, verifyToken, (req, res) => new Dcm(req, res).getDcm()); //Get dcm data
router.post(`/dcm/add`, verifyToken, (req, res) => new Dcm(req, res).addDcm()); //Add dcm data

/* History */
router.get(`/history/:client_id/:year/:month/:day`, verifyToken, HistoryData);
router.delete(`/history/:dcm_id`, verifyToken, HistoryDelete);

router.get(`/calendar/:date/:client_id`, verifyToken, Calendar);
router.get(`/materials/:client_id`, verifyToken, Materials);
router.get(`/company-resources*`, verifyToken, CompanyResources);

/* Biometrics */
router.get(`/biometrics/:device_id`, GetBiometric);
router.post(`/biometrics/:device_id`, verifyToken, SetBiometric);
router.delete(`/biometrics/:device_id`, verifyToken, DeleteBiometric);

module.exports = router;
