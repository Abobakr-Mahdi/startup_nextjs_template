"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/features/auth";
import { UserProfile } from "@/features/dashboard";
import { User } from "@/features/auth/types/auth";

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("welcome")}</h1>
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-muted animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
          </div>
          <div>
            <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t("welcome")}, {user?.name || t("user")}!
          </h1>
          <p className="text-muted-foreground mt-2">{t("dashboardSummary")}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: t("totalCourses"),
              value: "0",
            },
            {
              label: t("completed"),
              value: "0",
            },
            {
              label: t("inProgress"),
              value: "0",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground p-6 rounded-lg shadow-sm"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="col-span-2">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">{t("recentActivity")}</h2>
            </div>
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
              {[
                {
                  id: 1,
                  title: "Course 1",
                  description: "Description 1",
                  timestamp: "2021-01-01",
                  type: "course",
                },
                {
                  id: 2,
                  title: "Course 2",
                  description: "Description 2",
                  timestamp: "2021-01-02",
                  type: "course",
                },
              ].map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          activity.type === "course"
                            ? "bg-blue-500"
                            : activity.type === "achievement"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description} •{" "}
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Section with our enhanced component */}
        <div>
          {isAuthenticated && user && (
            <UserProfile initialData={user as User} userId={user?.id || ""} />
          )}
        </div>
      </div>
    </div>
  );
}
