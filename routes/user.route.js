const auth = require("../middleware/auth");
const User = require('mongoose');
const router = express.Router();

router.get("/current", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});
