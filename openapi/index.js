const { API_URL } = process.env;

const swagger = {
  openapi: "3.0.0",
  info: {
    title: "Express API for Compass",
    version: "1.0.0",
    description: "The REST API for Compas service",
  },
  servers: [
    {
      url: API_URL,
      description: "Development server",
    },
  ],
  produces: ["application/json"],
  paths: {
    "/init": {
      get: {
        "x-swagger-router-controller": "api",
        operationId: "init",
        tags: ["public API functions"],
        description: "Init application method",
        producer: "application/json",
        responses: {
          200: {
            description: "good init application.",
            content: {
              "application/json": {},
            },
            example: {
              date: 1623240416002,
              message: "good init application",
              session: {},
            },
            schema: {
              type: "object",
              properties: {
                date: {
                  type: "number",
                },
                message: {
                  type: "string",
                },
                session: {
                  type: "object",
                },
              },
            },
          },
        },
      },
    },
    "/auth": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "auth",
        tags: ["public API functions"],
        description: "login from application",
        parameters: [
          {
            name: "email",
            in: "formData",
            description: "email",
            type: "string",
            required: true,
          },
          {
            name: "password",
            in: "formData",
            description: "Password",
            type: "string",
            required: true,
          },
        ],
        responses: {},
      },
    },
    "/code": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "login",
        tags: ["public API functions"],
        description: "Login application with SMS code",
        parameters: [
          {
            name: "code",
            in: "formData",
            description: "SMS Code",
            required: true,
            type: "string",
          },
          {
            name: "id",
            in: "formData",
            description: "User id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/resend-code": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "resend code",
        tags: ["public API functions"],
        description: "Login resend with SMS code",
        parameters: [
          {
            name: "id",
            in: "formData",
            description: "User id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/register": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "register",
        tags: ["public API functions"],
        description: "Register function",
        parameters: [
          {
            name: "number",
            in: "formData",
            description: "Phone number",
            required: true,
            type: "string",
          },
          {
            name: "password",
            in: "formData",
            description: "Password",
            required: true,
            type: "string",
          },
          {
            name: "token",
            in: "formData",
            description: "Email token",
            required: true,
            type: "string",
          },
        ],
        producer: "application/json",
      },
    },
    "/logout": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "Logout",
        tags: ["public API functions"],
        description: "Logout function",
        responses: {},
      },
    },
    "/reset-password": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "Logout",
        tags: ["public API functions"],
        description: "Logout function",
        responses: {},
      },
    },
    "/avatar/:user_id": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "Uploda avatar",
        tags: ["public API functions"],
        description: "Upload avatar function",
        responses: {},
        consumes: "multipart/form-data",
        parameters: [
          {
            name: "user_id",
            in: "path",
            description: "User ID",
            type: "string",
            required: true,
          },
          {
            name: "file",
            in: "formData",
            description: "file",
            type: "file",
            required: true,
          },
        ],
      },
    },
    "/feedback": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "Feedback contact us",
        tags: ["public API functions"],
        description: "Feedback contact us",
        responses: {},
        parameters: [
          {
            name: "email",
            in: "formData",
            description: "email",
            type: "string",
            required: true,
          },
          {
            name: "message",
            in: "formData",
            description: "message",
            type: "string",
            required: true,
          },
        ],
      },
    },
    "/new-password": {
      put: {
        "x-swagger-router-controller": "api",
        operationId: "new password",
        tags: ["public API functions"],
        description: "new password function",
        parameters: [
          {
            name: "number",
            in: "formData",
            description: "Phone number",
            type: "string",
            required: true,
          },
          {
            name: "password",
            in: "formData",
            description: "Password",
            type: "string",
            required: true,
          },
        ],
        responses: {},
      },
    },
    "/main": {
      get: {
        "x-swagger-router-controller": "api",
        operationId: "main",
        tags: ["After login requests"],
        description: "Стартовая страница",
        responses: {},
      },
    },
    "/clients": {
      get: {
        "x-swagger-router-controller": "api",
        operationId: "clients",
        tags: ["Main page"],
        description: "Список клиентов",
        responses: {},
      },
    },
    "/domains": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "domains",
        tags: ["Main page"],
        description: "Список доменов",
        description: "Login application with SMS code",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/maladaptives": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "maladaptives",
        tags: ["Main page"],
        description: "Список maladaptives",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/subdomains": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "subdomains",
        tags: ["Main page"],
        description: "Список субдоменов",
        parameters: [
          {
            name: "parrent_id",
            in: "formData",
            description: "parrent_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/all/subdomains": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "all-subdomains",
        tags: ["Main page"],
        description: "Список всех субдоменов",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/skills": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "skills",
        tags: ["Main page"],
        description: "Список скилов",
        parameters: [
          {
            name: "parrent_id",
            in: "formData",
            description: "Subdomain parrent_id",
            required: true,
            type: "string",
          },
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/all/skills": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "all skills",
        tags: ["Main page"],
        description: "Список всех скилов",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
          {
            name: "domain_id",
            in: "formData",
            description: "domain_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/skills/data": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "all skills",
        tags: ["Main page"],
        description: "Список всех скилов",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
          {
            name: "skill_id",
            in: "formData",
            description: "skill_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/files": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "files",
        tags: ["Main page"],
        description: "Files list",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/dcm/get": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "dcm_get",
        tags: ["DCM data"],
        description: "dcm statistic list",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
          {
            name: "skill_id",
            in: "formData",
            description: "skill_id",
            required: true,
            type: "string",
          },
          {
            name: "day",
            in: "formData",
            description: "day",
            required: false,
            type: "string",
          },
          {
            name: "month",
            in: "formData",
            description: "month",
            required: false,
            type: "string",
          },
          {
            name: "year",
            in: "formData",
            description: "year",
            required: false,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/dcm/add": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "dcm_add",
        tags: ["DCM data"],
        description: "dcm statistic list",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
          {
            name: "skill_id",
            in: "formData",
            description: "skill_id",
            required: true,
            type: "string",
          },
          {
            name: "action_type",
            in: "formData",
            description: "action_type",
            required: true,
            type: "string",
          },
          {
            name: "stats_value",
            in: "formData",
            description: "stats_value",
            required: true,
            type: "string",
          },
          {
            name: "time_data",
            in: "formData",
            description: "time_data",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/get/graph": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "all skills",
        tags: ["Main page"],
        description: "График",
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: true,
            type: "string",
          },
          {
            name: "skill_id",
            in: "formData",
            description: "skill_id",
            required: true,
            type: "string",
          },
        ],
        responses: {},
      },
    },
    "/get/daily": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "dailyPlannerGet",
        tags: ["dailyPlanner"],
        description: "daily Plannerа",
        responses: {},
        parameters: [
          {
            name: "client_id",
            in: "formData",
            description: "client_id",
            required: false,
            type: "string",
          },
          {
            name: "day",
            in: "formData",
            description: "day",
            required: false,
            type: "number",
          },
          {
            name: "month",
            in: "formData",
            description: "month",
            required: false,
            type: "number",
          },
          {
            name: "year",
            in: "formData",
            description: "year",
            required: false,
            type: "number",
          },
        ],
      },
    },
    "/set/daily": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "dailyPlannerPost",
        tags: ["dailyPlanner"],
        description: "daily Planner",
        responses: {},
        parameters: [
          {
            name: "focus",
            in: "formData",
            description: "focus",
            required: false,
            type: "string",
          },
          {
            name: "goals",
            in: "formData",
            description: "goals",
            required: false,
            type: "string",
          },
          {
            name: "experiental",
            in: "formData",
            description: "experiental",
            required: false,
            type: "string",
          },
          {
            name: "experientalBehavior",
            in: "formData",
            description: "experientalBehavior",
            required: false,
            type: "string",
          },
          {
            name: "social",
            in: "formData",
            description: "social",
            required: false,
            type: "string",
          },
          {
            name: "socialBehavior",
            in: "formData",
            description: "socialBehavior",
            required: false,
            type: "string",
          },
          {
            name: "academicPresent",
            in: "formData",
            description: "academicPresent",
            required: false,
            type: "string",
          },
          {
            name: "academicHeader",
            in: "formData",
            description: "academicHeader",
            required: false,
            type: "string",
          },
          {
            name: "academicDescription",
            in: "formData",
            description: "academicDescription",
            required: false,
            type: "string",
          },
          {
            name: "cleaningPresent",
            in: "formData",
            description: "cleaningPresent",
            required: false,
            type: "string",
          },
          {
            name: "cleaningDescription",
            in: "formData",
            description: "cleaningDescription",
            required: false,
            type: "string",
          },
          {
            name: "session",
            in: "formData",
            description: "session",
            required: false,
            type: "string",
          },
          {
            name: "feelingBehavior",
            in: "formData",
            description: "feelingBehavior",
            required: false,
            type: "string",
          },
          {
            name: "rewardPresent",
            in: "formData",
            description: "rewardPresent",
            required: false,
            type: "string",
          },
          {
            name: "rewardDesrcirption",
            in: "formData",
            description: "rewardDesrcirption",
            required: false,
            type: "string",
          },
          {
            name: "behaviorReview",
            in: "formData",
            description: "behaviorReview",
            required: false,
            type: "string",
          },
          {
            name: "closerToGoalHeader",
            in: "formData",
            description: "closerToGoalHeader",
            required: false,
            type: "string",
          },
          {
            name: "closerToGoalDescription",
            in: "formData",
            description: "closerToGoalDescription",
            required: false,
            type: "string",
          },
          {
            name: "notes",
            in: "formData",
            description: "notes",
            required: false,
            type: "string",
          },
        ],
      },
    },
    "/history/:client_id/:year/:month/:day": {
      get: {
        "x-swagger-router-controller": "api",
        operationId: "Get history",
        tags: ["History"],
        description: "get client hostory",
        producer: "application/json",
        parameters: [
          {
            name: "client_id",
            in: "path",
            description: "Client ID",
            required: true,
          },
          {
            name: "year",
            in: "path",
            description: "year",
            required: true,
          },
          {
            name: "month",
            in: "path",
            description: "month",
            required: true,
          },
          {
            name: "day",
            in: "path",
            description: "day",
            required: true,
          },
        ],
        responses: {},
      },
    },
    "/history/:dcm_id": {
      delete: {
        "x-swagger-router-controller": "api",
        operationId: "delete history DCM",
        tags: ["History"],
        description: "delete history DCM",
        producer: "application/json",
        parameters: [
          {
            name: "dcm_id",
            in: "path",
            description: "dcm_id",
            required: true,
          },
        ],
        responses: {},
      },
    },
    "/calendar/:date/:client_id": {
      get: {
        "x-swagger-router-controller": "api",
        operationId: "Get calendar",
        tags: ["Calendar"],
        description: "get calendar data",
        producer: "application/json",
        parameters: [
          {
            name: "date",
            in: "path",
            description: "2021-12-01",
            required: true,
          },
          {
            name: "client_id",
            in: "path",
            description: "client_id",
            required: true,
          },
        ],
        responses: {},
      },
    },
    "/materials/:client_id": {
      get: {
        "x-swagger-router-controller": "api",
        operationId: "Get Materials",
        tags: ["Materials"],
        description: "get Materials data",
        producer: "application/json",
        parameters: [
          {
            name: "client_id",
            in: "path",
            description: "client_id",
            required: true,
          },
        ],
        responses: {},
      },
    },

    "/auth/:device_id": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "bio login",
        tags: ["Biometric function"],
        description: "login from application",
        parameters: [
          {
            name: "device_id",
            in: "formData",
            description: "device_id",
            type: "string",
            required: true,
          },
        ],
        responses: {},
      },
    },
    "/biometrics/:device_id": {
      get: {
        "x-swagger-router-controller": "api",
        operationId: "bio check",
        tags: ["Biometric function"],
        description: "get enabled bio auth",
        parameters: [
          {
            name: "device_id",
            in: "path",
            description: "device_id",
            type: "string",
            required: true,
          },
        ],
        responses: {},
      },
    },
    "/biometrics": {
      post: {
        "x-swagger-router-controller": "api",
        operationId: "set bio",
        tags: ["Biometric function"],
        description: "Set biometric",
        parameters: [
          {
            name: "device_id",
            in: "formData",
            description: "device_id",
            type: "string",
            required: true,
          },
        ],
        responses: {},
      },
      delete: {
        "x-swagger-router-controller": "api",
        operationId: "delete bio",
        tags: ["Biometric function"],
        description: "delete bio device",
        producer: "application/json",
        parameters: [],
        responses: {},
      },
    },
  },
};

module.exports = swagger;
