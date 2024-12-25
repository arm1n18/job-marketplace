package routes

import (
	auth "backend/api/Auth"
	company "backend/api/Company"
	inbox "backend/api/Inbox"
	job "backend/api/Job"
	necessarydata "backend/api/NecessaryData"
	profile "backend/api/Profile"
	response "backend/api/Response"
	resume "backend/api/Resume"
	report "backend/api/Statistics"
	"backend/services"
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func InitRouter(app *fiber.App, db *sql.DB) {
	authHandler := auth.Auth{}
	jobHandler := job.Job{}
	resumeHandler := resume.ResumeStruct{}
	companyHandler := company.CompanyResponse{}
	profileHandler := profile.Profile{}
	inboxHandler := inbox.Inbox{}
	reportHandler := report.Report{}
	responseHandler := response.Response{}
	necessaryDataHandler := necessarydata.NecessaryData{}

	jobsGroup := app.Group("/jobs", services.AuthMiddleware(db))
	{
		jobsGroup.Get("/", func(c *fiber.Ctx) error { return jobHandler.GetJobs(c, db) })
		jobsGroup.Get("/:id", func(c *fiber.Ctx) error { return jobHandler.GetJobByID(c, db) })
		jobsGroup.Post("/", services.RoleMiddleware("RECRUITER"), func(c *fiber.Ctx) error { return jobHandler.CreateJob(c, db) })
		jobsGroup.Delete("/:id", services.RoleMiddleware("RECRUITER"), services.CheckJobCreator(db), func(c *fiber.Ctx) error { return jobHandler.DeactivateJob(c, db) })
		jobsGroup.Put("/:id", services.RoleMiddleware("RECRUITER"), services.CheckJobCreator(db), func(c *fiber.Ctx) error { return jobHandler.UpdateJob(c, db) })
	}

	candidatesGroup := app.Group("/candidates", services.AuthMiddleware(db))
	{
		candidatesGroup.Get("/", func(c *fiber.Ctx) error { return resumeHandler.GetResumes(c, db) })
		candidatesGroup.Get("/:id", func(c *fiber.Ctx) error { return resumeHandler.GetResumeByID(c, db) })
		candidatesGroup.Post("/", services.RoleMiddleware("CANDIDATE"), services.CheckExistResume(db), func(c *fiber.Ctx) error { return resumeHandler.CreateResume(c, db) })
		candidatesGroup.Put("/:id", services.RoleMiddleware("CANDIDATE"), services.CheckResumeCreator(db), func(c *fiber.Ctx) error { return resumeHandler.UpdateResume(c, db) })
	}

	companyGroup := app.Group("/company", services.AuthMiddleware(db))
	{
		companyGroup.Get("/", func(c *fiber.Ctx) error { return companyHandler.GetCompaniesList(c, db) })
		companyGroup.Get("/jobs", func(c *fiber.Ctx) error { return companyHandler.GetCompanyJobsList(c, db) })
		companyGroup.Get("/:name", func(c *fiber.Ctx) error { return companyHandler.GetCompanyInfo(c, db) })
		companyGroup.Post("/", services.RoleMiddleware("RECRUITER"), services.CheckExistCompany(db), func(c *fiber.Ctx) error { return companyHandler.CreateCompany(c, db) })
	}

	authGroup := app.Group("/auth")
	{
		authGroup.Post("/register", authHandler.Register)
		authGroup.Post("/login", authHandler.Login)
		authGroup.Post("/logout", authHandler.LogOut)
		authGroup.Get("/refresh-token", authHandler.RefreshToken)
	}

	responseGroup := app.Group("/response", services.AuthMiddleware(db))
	{
		responseGroup.Post("/", func(c *fiber.Ctx) error { return responseHandler.Response(c, db) })
		responseGroup.Get("/candidate/:id", func(c *fiber.Ctx) error { return responseHandler.GetCandidateAllResponses(c, db) })
		responseGroup.Get("/application/:id", services.CheckAccessToApplicationInfo(db), func(c *fiber.Ctx) error { return responseHandler.GetApplicationInfo(c, db) })
		responseGroup.Get("/offer/:id", services.CheckAccessToOfferInfo(db), func(c *fiber.Ctx) error { return responseHandler.GetOfferInfo(c, db) })
	}

	inboxGroup := app.Group("/inbox", services.AuthMiddleware(db))
	{
		inboxGroup.Get("/", func(c *fiber.Ctx) error { return inboxHandler.GetInbox(c, db) })
	}

	statisticsGroup := app.Group("/statistics", services.AuthMiddleware(db))
	{
		statisticsGroup.Get("/", func(c *fiber.Ctx) error { return reportHandler.GetStatistics(c, db) })
	}

	app.Get("/keywords", func(c *fiber.Ctx) error { return necessaryDataHandler.GetKeywords(c, db) })

	app.Get("/user/avatar", services.AuthMiddleware(db), profileHandler.GetAvatar)
	app.Get("/user/profile", services.AuthMiddleware(db), func(c *fiber.Ctx) error { return profileHandler.GetUserProfile(c, db) })
}
