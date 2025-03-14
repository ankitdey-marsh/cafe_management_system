from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Connect to MongoDB Atlas
app.config["MONGO_URI"] = "mongodb+srv://personalankitdey:tankit999@cluster0.s8vxgku.mongodb.net/food_store?retryWrites=true&w=majority"
mongo = PyMongo(app)

cart_collection = mongo.db.cart  # Collection inside MongoDB

@app.route("/add-to-cart", methods=["POST"])
def add_to_cart():
    item = request.json
    existing_item = cart_collection.find_one({"name": item["name"]})

    if existing_item:
        cart_collection.update_one(
            {"name": item["name"]}, 
            {"$inc": {"quantity": 1}}
        )
    else:
        cart_collection.insert_one({"name": item["name"], "price": item["price"], "quantity": 1})

    return jsonify({"message": "Item added to cart"}), 201

@app.route("/cart", methods=["GET"])
def get_cart():
    cart_items = list(cart_collection.find({}, {"_id": 0}))
    return jsonify(cart_items)

@app.route("/cart/<string:name>", methods=["DELETE"])
def remove_from_cart(name):
    existing_item = cart_collection.find_one({"name": name})

    if existing_item:
        if existing_item["quantity"] > 1:
            cart_collection.update_one(
                {"name": name}, 
                {"$inc": {"quantity": -1}}
            )
        else:
            cart_collection.delete_one({"name": name})

        return jsonify({"message": f"Removed {name}"}), 200
    
    return jsonify({"error": "Item not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
