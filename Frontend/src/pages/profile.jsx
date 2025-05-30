"use client"

import { useState } from "react"
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  Gift,
  Search,
  ChevronRight,
  Star,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Home,
  Settings,
} from "lucide-react"

const PerfumeProfilePage = () => {
  const [user, setUser] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    memberSince: "2022",
    loyaltyPoints: 2450,
  })

  const [orders, setOrders] = useState([
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 189.99,
      items: [
        { name: "Chanel No. 5 Eau de Parfum", quantity: 1, price: 129.99 },
        { name: "Tom Ford Black Orchid", quantity: 1, price: 60.0 },
      ],
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-20",
      status: "shipped",
      total: 95.5,
      items: [{ name: "Dior Sauvage EDT", quantity: 1, price: 95.5 }],
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-22",
      status: "processing",
      total: 245.0,
      items: [{ name: "Creed Aventus", quantity: 1, price: 245.0 }],
    },
  ])

  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Yves Saint Laurent Black Opium", price: 98.0, image: "/placeholder.svg?height=80&width=80" },
    { id: 2, name: "Giorgio Armani Si", price: 85.0, image: "/placeholder.svg?height=80&width=80" },
    { id: 3, name: "Marc Jacobs Daisy", price: 72.0, image: "/placeholder.svg?height=80&width=80" },
  ])

  const [activeSection, setActiveSection] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-500" size={20} />
      case "shipped":
        return <Truck className="text-blue-500" size={20} />
      case "processing":
        return <Clock className="text-yellow-500" size={20} />
      case "cancelled":
        return <XCircle className="text-red-500" size={20} />
      default:
        return <Package className="text-gray-500" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="text-white" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.name}</h1>
        <p className="text-gray-600">Discover your perfect scent and manage your fragrance journey</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Order Status</h3>
              <p className="text-gray-600">Your latest order is on its way!</p>
            </div>
            <div className="text-yellow-600">
              <Truck size={32} />
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
              Track Order
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Loyalty Points</h3>
              <p className="text-gray-600">You have {user.loyaltyPoints} points to redeem</p>
            </div>
            <div className="text-yellow-600">
              <Star size={32} />
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
              View Rewards
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "My Orders", action: () => setActiveSection("orders") },
          { label: "Wishlist", action: () => setActiveSection("wishlist") },
          { label: "Addresses", action: () => setActiveSection("addresses") },
          { label: "Payments", action: () => setActiveSection("payments") },
          { label: "Security", action: () => setActiveSection("security") },
        ].map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
          >
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Package className="text-yellow-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">Order Management</h3>
              <p className="text-gray-600 text-sm mb-4">Track your orders, view history, and manage returns</p>
              <button
                onClick={() => setActiveSection("orders")}
                className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center"
              >
                Manage orders <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Shield className="text-gray-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">Account Security</h3>
              <p className="text-gray-600 text-sm mb-4">Your account is protected with 2-factor authentication</p>
              <button
                onClick={() => setActiveSection("security")}
                className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center"
              >
                Security settings <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOrdersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <div className="text-sm text-gray-600">{orders.length} orders found</div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <div>
                  <h3 className="font-semibold text-gray-800">Order {order.id}</h3>
                  <p className="text-sm text-gray-600">Placed on {order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">${order.total}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-2">Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="font-medium text-gray-800">${item.price}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-3 mt-4">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Track Order
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderWishlistContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
        <div className="text-sm text-gray-600">{wishlist.length} items saved</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-yellow-600">${item.price}</span>
              <div className="flex space-x-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors">
                  Add to Cart
                </button>
                <button className="text-red-500 hover:text-red-600">
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return renderOrdersContent()
      case "wishlist":
        return renderWishlistContent()
      case "addresses":
        return (
          <div className="text-center py-12">
            <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Address Book</h3>
            <p className="text-gray-600">Manage your shipping and billing addresses</p>
          </div>
        )
      case "payments":
        return (
          <div className="text-center py-12">
            <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Methods</h3>
            <p className="text-gray-600">Manage your saved payment methods</p>
          </div>
        )
      case "security":
        return (
          <div className="text-center py-12">
            <Shield className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Security Settings</h3>
            <p className="text-gray-600">Manage your password and security preferences</p>
          </div>
        )
      case "notifications":
        return (
          <div className="text-center py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
            <p className="text-gray-600">Manage your email and push notification preferences</p>
          </div>
        )
      case "rewards":
        return (
          <div className="text-center py-12">
            <Gift className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Rewards Program</h3>
            <p className="text-gray-600">View your points and available rewards</p>
          </div>
        )
      case "settings":
        return (
          <div className="text-center py-12">
            <Settings className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Settings</h3>
            <p className="text-gray-600">Manage your account preferences and settings</p>
          </div>
        )
      default:
        return renderHomeContent()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col h-screen">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Theoudlounge</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200 mt-auto">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">{renderContent()}</div>
    </div>
  )
}

export default PerfumeProfilePage
