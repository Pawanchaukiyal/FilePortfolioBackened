const Project = require("../models/project.model");

exports.createProject = async (req, res) => {
  try {
    const {
      name,
      status,
      category,
      tags,
      description,
    } = req.body;

    const image = req.files?.image?.[0]?.path || "";
    const video = req.files?.video?.[0]?.path || "";
    const file = req.files?.file?.[0]?.path;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Creating project instance
    const project = new Project({
      name,
      image,
      video,
      file,
      status,
      category,
      tags: tags ? tags.split(",") : [],
      description,
      createdBy: req.user.userId,  // Ensure userId is passed correctly
    });

    // Save the project
    await project.save();

    // Return response
    res.status(201).json({
      message: "Project created successfully",
      project: project.toObject(), // Converting Mongoose document to plain object
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
      const projects = await Project.find().populate("createdBy", "email");
      res.json(projects);
  } catch (error) {
      res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Search Projects by Name
// exports.searchProjects = async (req, res) => {
//   try {
//       const { name } = req.query;
//       const projects = await Project.find({ name: { $regex: name, $options: "i" } });
//       res.json(projects);
//   } catch (error) {
//       res.status(500).json({ message: "❌ Error: " + error.message });
//   }
// };
// 🔹 Search Projects by Name and Tag
exports.searchProjects = async (req, res) => {
  try {
    const { name, tag } = req.query;

    // Build query object dynamically based on the input parameters
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search by name
    }

    if (tag) {
      query.tags = { $in: [tag] }; // Search for projects containing the tag
    }

    // Find projects based on the query
    const projects = await Project.find(query);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Update Project (Only Owner or Admin)
// 🔹 Update Project (Only Owner or Admin)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    // 🛡️ Access control: only owner or admin
    if (!project.createdBy.equals(req.user.userId) && req.user.role !== "admin")
    {
      return res.status(403).json({ message: "⛔ Access Denied" });
    }

    // 📝 Get form fields
    const { name, status, category, tags, description } = req.body;

    // ✅ Update text fields
    project.name = name || project.name;
    project.status = status || project.status;
    project.category = category || project.category;
    project.tags = tags ? tags.split(",") : project.tags;
    project.description = description || project.description;

    // ✅ Update uploaded files if present
    if (req.files?.image?.[0]) {
      project.image = req.files.image[0].path;
    }
    if (req.files?.video?.[0]) {
      project.video = req.files.video[0].path;
    }
    if (req.files?.file?.[0]) {
      project.file = req.files.file[0].path;
    }

    // 💾 Save changes
    await project.save();

    res.json({ message: "✅ Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};


// 🔹 Delete Project (Only Owner or Admin)
exports.deleteProject = async (req, res) => {
  try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: "❌ Project not found" });

      if (!project.createdBy.equals(req.user.userId) && req.user.role !== "admin")
      {
          return res.status(403).json({ message: "⛔ Access Denied" });
      }

      await Project.findByIdAndDelete(req.params.id);
      res.json({ message: "✅ Project deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Get Single Project (Admin Access)
exports.getProjectById = async (req, res) => {
  try {
      const project = await Project.findById(req.params.id).populate("createdBy", "email");
      if (!project) return res.status(404).json({ message: "❌ Project not found" });

      res.json(project);
  } catch (error) {
      res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Get Projects by Logged-in User
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.userId });
    if (!projects.length) {
      return res.status(404).json({ message: "Sorry, no projects right now." });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};
