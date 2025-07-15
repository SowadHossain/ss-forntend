import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

export default function BuyerProfilePage() {
  const buyer = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg",
    joined: "January 2024",
    orders: 14,
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={buyer.avatar} alt={buyer.name} />
              <AvatarFallback>{buyer.name[0]}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{buyer.name}</CardTitle>
            <p className="text-gray-500">{buyer.email}</p>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Joined</span>
              <span>{buyer.joined}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Orders</span>
              <span>{buyer.orders}</span>
            </div>

            <div className="mt-6 flex gap-4">
              <Button className="flex-1">Edit Profile</Button>
              <Button variant="outline" className="flex-1">
                View Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
