import Router from "../models/router.model.js";

export const createRouterLog = async (req, res) => {
  try {
    const { prompt, agent, conversationId } = req.body;

    const router = await Router.create({
      conversationId,
      prompt,
      agent,
    });

    res.status(201).json({
      success: true,
      data: router,
    });
  } catch (error) {
    console.log("Router Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to store router data",
    });
  }
};

export const getAgent = async (req, res) => {
  try {
    const { conversationId } = req.body;

    const router = await Router.findOne({ conversationId });

    if (!router) {
      return res.status(404).json({
        success: false,
        message: "Agent log not found",
      });
    }

    res.status(200).json({
      success: true,
      data: router,
    });
  } catch (error) {
    console.log("Get Agent Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch agent data",
    });
  }
};


