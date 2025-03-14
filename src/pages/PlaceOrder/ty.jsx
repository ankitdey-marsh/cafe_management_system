import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // ✅ Import this to enable tables

const ThankYou = () => {
  const { cartItems, food_list, getTotalCartAmount, clearCart } = useContext(StoreContext);

  const generateInvoice = () => {
    const doc = new jsPDF();

    doc.text("Invoice", 20, 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text("Thank you for your order!", 20, 40);

    const tableColumn = ["Item", "Quantity", "Price"];
    const tableRows = [];

    // Populate table rows from cartItems
    Object.keys(cartItems).forEach((itemId) => {
      const item = food_list.find((food) => food._id === itemId);
      if (item) {
        const rowData = [item.name, cartItems[itemId], `$${(item.price * cartItems[itemId]).toFixed(2)}`];
        tableRows.push(rowData);
      }
    });

    // ✅ Ensure autoTable works
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });

    // Total price
    doc.text(`Total: $${getTotalCartAmount().toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save("invoice.pdf");
  };

  return (
    <div className="thank-you-container">
      <h1>Thank You for Your Order! 🎉</h1>
      <p>Your food is being prepared. We will notify you once it's ready.</p>

      {/* Download Bill Button */}
      <button onClick={generateInvoice}>Download Bill</button>

      <Link to="/">
        <button onClick={() => { clearCart(); }}>Return to Home</button>
      </Link>
    </div>
  );
};

export default ThankYou;
