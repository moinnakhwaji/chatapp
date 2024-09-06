import { body, check, param, validationResult, query } from "express-validator";

const validateHandeler = (req, res, next) => {
  const errors = validationResult(req);
  const errormessage = errors
    .array()
    .map((array) => array.msg)
    .join(",");

  console.log(errormessage);
  if (errors.isEmpty()) {
    return next(errormessage);
  }
};

const registervalidator = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("bio").notEmpty(),
];
const loginvalidator = () => [
  body("username").notEmpty().withMessage("username required"),
  body("password").notEmpty().withMessage("password required"),
];

const newGroupValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members must be 2-100"),
];
const addmemeberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be 1-97"),
];
const removememberValidator = () => [
  body("chatId").notEmpty().withMessage("please provide id"),
  body("userId").notEmpty().withMessage("please provide member"),
];
const leavegroupValidotor = () => [
  param("id").notEmpty().withMessage("user not found"), // ye jo dynamic route rehta na jo waha deta bas usme bhi wahi denge jaise isme hamne yaha id di hai
];

const sendAttachementValidator = () => [
  body("chatId").notEmpty().withMessage("chat not found"),

];
const getmessageValidator = () => [
  param("id").notEmpty().withMessage("please enter chatid"),
];

const getchatDetailValidetor = () => [
  param("id").notEmpty().withMessage("please enter chatid"),
];

const chatIdValidator = () => [
  param("id").notEmpty().withMessage("please provide a chatid"),
];
const renameGroupValidator = () => [
  param("id").notEmpty().withMessage("Group id is required"),
  body("name").notEmpty().withMessage("group name cannot be empty"),
];
const sendRequestValidator = ()=>[
    body("userId").notEmpty().withMessage("please provide userid")
]

const getallnotificationvalidator = ()=>[
  body("accept").notEmpty().withMessage("please provide accept status"),
  body("requestId").notEmpty().withMessage("please provide request id")
]




export {
  registervalidator,
  getallnotificationvalidator,
  sendRequestValidator,
  renameGroupValidator,
  validateHandeler,
  chatIdValidator,
  loginvalidator,
  newGroupValidator,
  addmemeberValidator,
  leavegroupValidotor,
  sendAttachementValidator,
  getmessageValidator,
  removememberValidator,
  getchatDetailValidetor,
};
