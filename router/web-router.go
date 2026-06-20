package router

import (
	"embed"
	"net/http"
	"os"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// ThemeAssets holds the embedded frontend assets for both themes.
type ThemeAssets struct {
	DefaultBuildFS   embed.FS
	DefaultIndexPage []byte
	ClassicBuildFS   embed.FS
	ClassicIndexPage []byte
	CommerceBuildFS   embed.FS
	CommerceIndexPage []byte
}

func SetWebRouter(router *gin.Engine, assets ThemeAssets) {
	defaultFS := common.EmbedFolder(assets.DefaultBuildFS, "web/default/dist")
	classicFS := common.EmbedFolder(assets.ClassicBuildFS, "web/classic/dist")
	commerceFS := common.EmbedFolder(assets.CommerceBuildFS, "web/commerce/dist")
	themeFS := common.NewThemeAwareFS(defaultFS, classicFS, commerceFS)

	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())

	// Middleware phục vụ tài liệu trực tiếp từ ổ đĩa thực (local disk) nếu tồn tại
	router.Use(func(c *gin.Context) {
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/docs/") {
			hasExt := false
			if dot := strings.LastIndex(path, "."); dot > -1 && dot > strings.LastIndex(path, "/") {
				hasExt = true
			}

			if hasExt {
				// Thử tìm ở ./docs/... trước
				filePath := "." + path
				if _, err := os.Stat(filePath); err == nil {
					c.File(filePath)
					c.Abort()
					return
				}

				// Thử tìm ở ./dist/docs/...
				filePathDist := "./dist" + path
				if _, err := os.Stat(filePathDist); err == nil {
					c.File(filePathDist)
					c.Abort()
					return
				}
			}
		}
		c.Next()
	})

	router.Use(static.Serve("/", themeFS))
	router.NoRoute(func(c *gin.Context) {
		c.Set(middleware.RouteTagKey, "web")
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") || strings.HasPrefix(c.Request.RequestURI, "/assets") {
			controller.RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		if common.GetTheme() == "classic" {
			c.Data(http.StatusOK, "text/html; charset=utf-8", assets.ClassicIndexPage)
		} else if common.GetTheme() == "commerce" {
			c.Data(http.StatusOK, "text/html; charset=utf-8", assets.CommerceIndexPage)
		} else {
			c.Data(http.StatusOK, "text/html; charset=utf-8", assets.DefaultIndexPage)
		}
	})
}
