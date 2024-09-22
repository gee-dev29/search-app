
export const viewNotifications = async (req, res) => {
    try {
        // const user = req.user
        return res.status(200).json({ payload: req.user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};