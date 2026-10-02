const User = require("../../model/User");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Role = require("../../model/Role");

exports.create = async (req, res) => {
    try {
        const { fname, lname, email, contact, password } = req.body
        const users = await User.create({
            name: fname + " " + lname,
            contact: contact,
            email: email,
            password: password,
        },{logging: console.log })
        res.send(SUCCESS("Successfully register user", users))
    } catch (err) {
        res.send(ERROR("Not match data" + err));
    }
}


exports.users = async (req, res) => {
    try {
        const usersRecords = await User.findAll({
            attributes: {
                exclude: ["password"]
            }
        });
        res.send(SUCCESS("User Records", usersRecords));
    } catch (err) {
        res.send(ERROR(err))
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.send(ERROR("user not found!"));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send(ERROR("Invalid password"));
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECERET_KEY || "secretkey",
            { expiresIn: "1d" }
        );

        res.send(SUCCESS("Login successful", {
            token: token,
            user: {
                id: user.id,
                email: user.email
            }
        }))
    } catch (err) {
        return res.send(ERROR(err.message));
    }
};


exports.update = async (req, res) => {
    try {
        const { id } = req.user;
        const { job, dob, gender, address, city, state, pincode } = req.body
        const img = req.file ? req.file.filename : null;
        const updateProfile = await User.update(
            {
                job,
                dob,
                gender,
                address,
                city,
                state,
                pincode,
                img
            },
            {
                where: { id: id }
            }
        )
        res.send(SUCCESS("successfully update recoreds", updateProfile))
    } catch (err) {
        res.send(err)
    }
}

exports.findByid = async (req, res) => {
    try {

        const { id } = req.params;

        const usersRecords = await User.findOne({
            attributes: {
                exclude: ["password"],
            },
            where: { id },
        });

        res.send(SUCCESS("User Records", usersRecords));

    } catch (err) {
        res.send(ERROR(err));
    }
};



exports.findByPk = async (req, res) => {
    try {
        const { id } = req.user;

        const usersRecords = await User.findByPk(id, {
            include: [{ model: Role, as: "role", attributes: ["id", "role_name"] }],
            attributes: { exclude: ["password"] }
        });

        if (!usersRecords) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.send(SUCCESS("User Records", usersRecords));

    } catch (err) {
        res.send(ERROR(err));
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateMyProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const {
            name,
            contact,
            contact2,
            job,
            dob,
            gender,
            address,
            city,
            state,
            pincode,
        } = req.body;

        const files = req.files || {};
        const img = files.img ? files.img[0].filename : (req.file ? req.file.filename : user.img);

        const updateData = {};
        if (name) updateData.name = name;
        if (contact) updateData.contact = contact;
        if (contact2 !== undefined) updateData.contact2 = contact2 && String(contact2).trim() !== "" ? String(contact2).trim() : null;
        if (job !== undefined) updateData.job = job && String(job).trim() !== "" ? String(job).trim() : null;
        if (dob !== undefined) updateData.dob = dob && String(dob).trim() !== "" ? String(dob).trim() : null;
        if (gender) updateData.gender = gender;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;
        if (pincode !== undefined) updateData.pincode = pincode ? parseInt(pincode) : null;
        if (img) updateData.img = img;

        await user.update(updateData);

        const updatedUser = await User.findByPk(id, {
            include: [{ model: Role, as: "role", attributes: ["id", "role_name"] }],
            attributes: { exclude: ["password"] }
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};



const generateAutoPassword = (name, dobString) => {
  const cleanName = (name || "user").replace(/[^a-zA-Z]/g, "").toLowerCase();
  const namePart = cleanName.padEnd(4, "x").substring(0, 4);
  let day = "01";
  let month = "01";

  if (dobString) {
    const dateObj = new Date(dobString);
    if (!isNaN(dateObj.getTime())) {
      day = String(dateObj.getDate()).padStart(2, "0");
      month = String(dateObj.getMonth() + 1).padStart(2, "0");
    }
  } else {
    const today = new Date();
    day = String(today.getDate()).padStart(2, "0");
    month = String(today.getMonth() + 1).padStart(2, "0");
  }

  return `${namePart}${day}${month}`; // Total 8 characters
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: "role", attributes: ["id", "role_name"] }],
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Create or Update Full User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Extract body fields
    const {
      name,
      contact,
      contact2,
      contact3,
      job,
      dob,
      gender,
      email,
      password,
      sifting_type,
      shift,
      base_pay,
      insurance,
      role_id,
      address,
      city,
      state,
      pincode,
      v_code,
      isvarified,
      isactive,
    } = req.body;

    let user = await User.findByPk(userId);

    // Extract uploaded files from Multer
    const files = req.files || {};
    const img = files.img ? files.img[0].filename : user?.img;
    const adharcard_front = files.adharcard_front ? files.adharcard_front[0].filename : user?.adharcard_front;
    const adharcard_back = files.adharcard_back ? files.adharcard_back[0].filename : user?.adharcard_back;
    const insurance_pic = files.insurance_pic ? files.insurance_pic[0].filename : user?.insurance_pic;

    const profileData = {
      name,
      contact,
      contact2: contact2 && String(contact2).trim() !== "" ? String(contact2).trim() : null,
      contact3: contact3 && String(contact3).trim() !== "" ? String(contact3).trim() : null,
      job: job && String(job).trim() !== "" ? String(job).trim() : null,
      dob: dob && String(dob).trim() !== "" ? String(dob).trim() : null,
      gender: gender || "male",
      email,
      sifting_type: sifting_type ? parseInt(sifting_type) : null,
      shift: shift && String(shift).trim() !== "" ? String(shift).trim() : null,
      base_pay: base_pay ? parseInt(base_pay) : null,
      insurance: insurance === "true" || insurance === true,
      role_id: role_id ? parseInt(role_id) : 1,
      address,
      city,
      state,
      pincode: pincode ? parseInt(pincode) : null,
      v_code: v_code ? parseInt(v_code) : null,
      isvarified: isvarified === "true" || isvarified === true,
      isactive: isactive === "true" || isactive === true,
      img,
      adharcard_front,
      adharcard_back,
      insurance_pic,
    };

    if (!user) {

      user = await User.create(profileData);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        autoGeneratedPassword: generatedPlainPassword, // Returned for admin reference upon creation
        data: user,
      });
    }

    // 2. UPDATE FLOW
    // Only update password if a new non-empty password is passed explicitly
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      profileData.password = await bcrypt.hash(password, salt);
    }

    await user.update(profileData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


exports.createUserProfile = async (req, res) => {
  try {
    const {
      name,
      contact,
      contact2,
      contact3,
      job,
      dob,
      gender,
      email,
      password,
      sifting_type,
      shift,
      base_pay,
      insurance,
      role_id,
      address,
      city,
      state,
      pincode,
      v_code,
      isvarified,
      isactive,
    } = req.body;

    // Check if user with same unique fields already exists
    const existingUser = await User.findOne({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(300).json({
        status: 300,
        message: "Email address already exists. Validation error.",
      });
    }

    // Extract file paths from Multer uploads
    const files = req.files || {};
    const img = files.img ? files.img[0].filename : null;
    const adharcard_front = files.adharcard_front ? files.adharcard_front[0].filename : null;
    const adharcard_back = files.adharcard_back ? files.adharcard_back[0].filename : null;
    const insurance_pic = files.insurance_pic ? files.insurance_pic[0].filename : null;

    // Password generation handling
    let rawPassword = password;
    let autoGeneratedPassword = null;

    if (!rawPassword || rawPassword.trim() === "") {
      rawPassword = generateAutoPassword(name, dob);
      autoGeneratedPassword = rawPassword;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // Sanitize optional unique fields (convert empty strings to null)
    const newUser = await User.create({
      name,
      contact,
      contact2: contact2 && String(contact2).trim() !== "" ? String(contact2).trim() : null,
      contact3: contact3 && String(contact3).trim() !== "" ? String(contact3).trim() : null,
      job: job && String(job).trim() !== "" ? String(job).trim() : null,
      dob: dob && String(dob).trim() !== "" ? String(dob).trim() : null,
      gender: gender || "male",
      email,
      password: hashedPassword,
      sifting_type: sifting_type ? parseInt(sifting_type) : null,
      shift: shift && String(shift).trim() !== "" ? String(shift).trim() : null,
      base_pay: base_pay ? parseInt(base_pay) : null,
      insurance: insurance === "true" || insurance === true,
      role_id: role_id ? parseInt(role_id) : 1,
      address: address || null,
      city: city || null,
      state: state || null,
      pincode: pincode ? parseInt(pincode) : null,
      v_code: v_code ? parseInt(v_code) : null,
      isvarified: isvarified === "true" || isvarified === true,
      isactive: isactive === "true" || isactive === true,
      img,
      adharcard_front,
      adharcard_back,
      insurance_pic,
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "New user profile created successfully!",
      autoGeneratedPassword,
      data: newUser,
    });

  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const duplicateField = error.errors[0]?.path || "Field";
      return res.status(300).json({
        status: 300,
        message: `${duplicateField} already exists in the system. Validation error.`,
      });
    }

    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await user.destroy();
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};