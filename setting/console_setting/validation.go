package console_setting

import (
	"encoding/json"
	"fmt"
	"net/url"
	"regexp"
	"sort"
	"strings"
	"time"
)

var (
	urlRegex       = regexp.MustCompile(`^https?://(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?:\:[0-9]{1,5})?(?:/.*)?$`)
	dangerousChars = []string{"<script", "<iframe", "javascript:", "onload=", "onerror=", "onclick="}
	validColors    = map[string]bool{
		"blue": true, "green": true, "cyan": true, "purple": true, "pink": true,
		"red": true, "orange": true, "amber": true, "yellow": true, "lime": true,
		"light-green": true, "teal": true, "light-blue": true, "indigo": true,
		"violet": true, "grey": true, "slate": true,
	}
	slugRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)
)

func parseJSONArray(jsonStr string, typeName string) ([]map[string]interface{}, error) {
	var list []map[string]interface{}
	if err := json.Unmarshal([]byte(jsonStr), &list); err != nil {
		return nil, fmt.Errorf("định dạng %s không hợp lệ: %s", typeName, err.Error())
	}
	return list, nil
}

func validateURL(urlStr string, index int, itemType string) error {
	if !urlRegex.MatchString(urlStr) {
		return fmt.Errorf("URL của %s thứ %d không đúng định dạng", itemType, index)
	}
	if _, err := url.Parse(urlStr); err != nil {
		return fmt.Errorf("Không thể phân tích cú pháp URL của %s thứ %d: %s", itemType, index, err.Error())
	}
	return nil
}

func checkDangerousContent(content string, index int, itemType string) error {
	lower := strings.ToLower(content)
	for _, d := range dangerousChars {
		if strings.Contains(lower, d) {
			return fmt.Errorf("%s thứ %d chứa nội dung không được phép", itemType, index)
		}
	}
	return nil
}

func getJSONList(jsonStr string) []map[string]interface{} {
	if jsonStr == "" {
		return []map[string]interface{}{}
	}
	var list []map[string]interface{}
	json.Unmarshal([]byte(jsonStr), &list)
	return list
}

func ValidateConsoleSettings(settingsStr string, settingType string) error {
	if settingsStr == "" {
		return nil
	}

	switch settingType {
	case "ApiInfo":
		return validateApiInfo(settingsStr)
	case "Announcements":
		return validateAnnouncements(settingsStr)
	case "FAQ":
		return validateFAQ(settingsStr)
	case "UptimeKumaGroups":
		return validateUptimeKumaGroups(settingsStr)
	default:
		return fmt.Errorf("Loại cấu hình không xác định: %s", settingType)
	}
}

func validateApiInfo(apiInfoStr string) error {
	apiInfoList, err := parseJSONArray(apiInfoStr, "thông tin API")
	if err != nil {
		return err
	}

	if len(apiInfoList) > 50 {
		return fmt.Errorf("Số lượng thông tin API không được vượt quá 50")
	}

	for i, apiInfo := range apiInfoList {
		urlStr, ok := apiInfo["url"].(string)
		if !ok || urlStr == "" {
			return fmt.Errorf("Thông tin API thứ %d thiếu trường URL", i+1)
		}
		route, ok := apiInfo["route"].(string)
		if !ok || route == "" {
			return fmt.Errorf("Thông tin API thứ %d thiếu trường mô tả đường truyền", i+1)
		}
		description, ok := apiInfo["description"].(string)
		if !ok || description == "" {
			return fmt.Errorf("Thông tin API thứ %d thiếu trường mô tả chi tiết", i+1)
		}
		color, ok := apiInfo["color"].(string)
		if !ok || color == "" {
			return fmt.Errorf("Thông tin API thứ %d thiếu trường màu sắc", i+1)
		}

		if err := validateURL(urlStr, i+1, "thông tin API"); err != nil {
			return err
		}

		if len(urlStr) > 500 {
			return fmt.Errorf("Độ dài URL của thông tin API thứ %d không được vượt quá 500 ký tự", i+1)
		}
		if len(route) > 100 {
			return fmt.Errorf("Độ dài mô tả đường truyền của thông tin API thứ %d không được vượt quá 100 ký tự", i+1)
		}
		if len(description) > 200 {
			return fmt.Errorf("Độ dài mô tả chi tiết của thông tin API thứ %d không được vượt quá 200 ký tự", i+1)
		}

		if !validColors[color] {
			return fmt.Errorf("Mã màu của thông tin API thứ %d không hợp lệ", i+1)
		}

		if err := checkDangerousContent(description, i+1, "thông tin API"); err != nil {
			return err
		}
		if err := checkDangerousContent(route, i+1, "thông tin API"); err != nil {
			return err
		}
	}
	return nil
}

func GetApiInfo() []map[string]interface{} {
	return getJSONList(GetConsoleSetting().ApiInfo)
}

func validateAnnouncements(announcementsStr string) error {
	list, err := parseJSONArray(announcementsStr, "thông báo hệ thống")
	if err != nil {
		return err
	}
	if len(list) > 100 {
		return fmt.Errorf("Số lượng thông báo hệ thống không được vượt quá 100")
	}
	validTypes := map[string]bool{
		"default": true, "ongoing": true, "success": true, "warning": true, "error": true,
	}
	for i, ann := range list {
		content, ok := ann["content"].(string)
		if !ok || content == "" {
			return fmt.Errorf("Thông báo thứ %d thiếu trường nội dung", i+1)
		}
		publishDateAny, exists := ann["publishDate"]
		if !exists {
			return fmt.Errorf("Thông báo thứ %d thiếu trường ngày đăng", i+1)
		}
		publishDateStr, ok := publishDateAny.(string)
		if !ok || publishDateStr == "" {
			return fmt.Errorf("Ngày đăng của thông báo thứ %d không được để trống", i+1)
		}
		if _, err := time.Parse(time.RFC3339, publishDateStr); err != nil {
			return fmt.Errorf("Định dạng ngày đăng của thông báo thứ %d không đúng", i+1)
		}
		if t, exists := ann["type"]; exists {
			if typeStr, ok := t.(string); ok {
				if !validTypes[typeStr] {
					return fmt.Errorf("Loại thông báo thứ %d không hợp lệ", i+1)
				}
			}
		}
		if len(content) > 500 {
			return fmt.Errorf("Độ dài nội dung của thông báo thứ %d không được vượt quá 500 ký tự", i+1)
		}
		if extra, exists := ann["extra"]; exists {
			if extraStr, ok := extra.(string); ok && len(extraStr) > 200 {
				return fmt.Errorf("Độ dài phần phụ chú của thông báo thứ %d không được vượt quá 200 ký tự", i+1)
			}
		}
	}
	return nil
}

func validateFAQ(faqStr string) error {
	list, err := parseJSONArray(faqStr, "thông tin FAQ")
	if err != nil {
		return err
	}
	if len(list) > 100 {
		return fmt.Errorf("Số lượng FAQ không được vượt quá 100")
	}
	for i, faq := range list {
		question, ok := faq["question"].(string)
		if !ok || question == "" {
			return fmt.Errorf("FAQ thứ %d thiếu trường câu hỏi", i+1)
		}
		answer, ok := faq["answer"].(string)
		if !ok || answer == "" {
			return fmt.Errorf("FAQ thứ %d thiếu trường câu trả lời", i+1)
		}
		if len(question) > 200 {
			return fmt.Errorf("Độ dài câu hỏi của FAQ thứ %d không được vượt quá 200 ký tự", i+1)
		}
		if len(answer) > 1000 {
			return fmt.Errorf("Độ dài câu trả lời của FAQ thứ %d không được vượt quá 1000 ký tự", i+1)
		}
	}
	return nil
}

func getPublishTime(item map[string]interface{}) time.Time {
	if v, ok := item["publishDate"]; ok {
		if s, ok2 := v.(string); ok2 {
			if t, err := time.Parse(time.RFC3339, s); err == nil {
				return t
			}
		}
	}
	return time.Time{}
}

func GetAnnouncements() []map[string]interface{} {
	list := getJSONList(GetConsoleSetting().Announcements)
	sort.SliceStable(list, func(i, j int) bool {
		return getPublishTime(list[i]).After(getPublishTime(list[j]))
	})
	return list
}

func GetFAQ() []map[string]interface{} {
	return getJSONList(GetConsoleSetting().FAQ)
}

func validateUptimeKumaGroups(groupsStr string) error {
	groups, err := parseJSONArray(groupsStr, "cấu hình nhóm Uptime Kuma")
	if err != nil {
		return err
	}

	if len(groups) > 20 {
		return fmt.Errorf("Số lượng nhóm Uptime Kuma không được vượt quá 20")
	}

	nameSet := make(map[string]bool)

	for i, group := range groups {
		categoryName, ok := group["categoryName"].(string)
		if !ok || categoryName == "" {
			return fmt.Errorf("Nhóm thứ %d thiếu trường tên danh mục", i+1)
		}
		if nameSet[categoryName] {
			return fmt.Errorf("Tên danh mục của nhóm thứ %d bị trùng lặp với nhóm khác", i+1)
		}
		nameSet[categoryName] = true
		urlStr, ok := group["url"].(string)
		if !ok || urlStr == "" {
			return fmt.Errorf("Nhóm thứ %d thiếu trường URL", i+1)
		}
		slug, ok := group["slug"].(string)
		if !ok || slug == "" {
			return fmt.Errorf("Nhóm thứ %d thiếu trường Slug", i+1)
		}
		description, ok := group["description"].(string)
		if !ok {
			description = ""
		}

		if err := validateURL(urlStr, i+1, "nhóm"); err != nil {
			return err
		}

		if len(categoryName) > 50 {
			return fmt.Errorf("Độ dài tên danh mục của nhóm thứ %d không được vượt quá 50 ký tự", i+1)
		}
		if len(urlStr) > 500 {
			return fmt.Errorf("Độ dài URL của nhóm thứ %d không được vượt quá 500 ký tự", i+1)
		}
		if len(slug) > 100 {
			return fmt.Errorf("Độ dài Slug của nhóm thứ %d không được vượt quá 100 ký tự", i+1)
		}
		if len(description) > 200 {
			return fmt.Errorf("Độ dài mô tả của nhóm thứ %d không được vượt quá 200 ký tự", i+1)
		}

		if !slugRegex.MatchString(slug) {
			return fmt.Errorf("Slug của nhóm thứ %d chỉ được phép chứa chữ cái, số, dấu gạch dưới và dấu gạch ngang", i+1)
		}

		if err := checkDangerousContent(description, i+1, "nhóm"); err != nil {
			return err
		}
		if err := checkDangerousContent(categoryName, i+1, "nhóm"); err != nil {
			return err
		}
	}
	return nil
}

func GetUptimeKumaGroups() []map[string]interface{} {
	return getJSONList(GetConsoleSetting().UptimeKumaGroups)
}
