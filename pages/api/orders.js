import connectToDB from "@/lib/database"; // Import koneksi database

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { movie, selectedSeats, selectedDate, selectedTime, totalPrice, paymentMethod } = req.body;

      const query = `
        INSERT INTO orders (movie, seats, date, time, total_price, payment_method, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        JSON.stringify(movie),
        JSON.stringify(selectedSeats),
        selectedDate,
        selectedTime,
        totalPrice,
        paymentMethod,
        "Paid",
      ];

      const [result] = await db.execute(query, values);

      return res.status(201).json({ message: "Order created successfully!", id: result.insertId });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Failed to create order!" });
    }
  } else if (req.method === "GET") {
    try {
      const [rows] = await db.execute("SELECT * FROM orders ORDER BY created_at DESC");
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Failed to fetch orders!" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
