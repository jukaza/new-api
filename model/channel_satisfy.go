package model

import (
	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/setting/ratio_setting"
)

func IsChannelEnabledForGroupModel(group string, modelName string, channelID int) bool {
	if modelName == "" || channelID <= 0 {
		return false
	}
	// Simplified group model: every channel serves all groups, so we no
	// longer filter by group. We keep the `group` argument for caller
	// compatibility but do not use it.
	_ = group
	if !common.MemoryCacheEnabled {
		return isChannelEnabledForGroupModelDB(group, modelName, channelID)
	}

	channelSyncLock.RLock()
	defer channelSyncLock.RUnlock()

	if group2model2channels == nil {
		return false
	}

	// Look up the model across any group (channels serve all groups).
	if isChannelIDInList(anyChannelsForModel(modelName), channelID) {
		return true
	}
	normalized := ratio_setting.FormatMatchingModelName(modelName)
	if normalized != "" && normalized != modelName {
		return isChannelIDInList(anyChannelsForModel(normalized), channelID)
	}
	return false
}

// anyChannelsForModel returns the channel-id list for a model across any
// known group. Since channels serve all groups, any group that has the model
// yields the full channel list.
func anyChannelsForModel(modelName string) []int {
	for _, model2channels := range group2model2channels {
		if cand := model2channels[modelName]; len(cand) > 0 {
			return cand
		}
	}
	return nil
}

func IsChannelEnabledForAnyGroupModel(groups []string, modelName string, channelID int) bool {
	if len(groups) == 0 {
		return false
	}
	for _, g := range groups {
		if IsChannelEnabledForGroupModel(g, modelName, channelID) {
			return true
		}
	}
	return false
}

func isChannelEnabledForGroupModelDB(group string, modelName string, channelID int) bool {
	// Simplified group model: every channel serves all groups, so we no
	// longer filter abilities by group.
	_ = group
	var count int64
	err := DB.Model(&Ability{}).
		Where("model = ? and channel_id = ? and enabled = ?", modelName, channelID, true).
		Count(&count).Error
	if err == nil && count > 0 {
		return true
	}
	normalized := ratio_setting.FormatMatchingModelName(modelName)
	if normalized == "" || normalized == modelName {
		return false
	}
	count = 0
	err = DB.Model(&Ability{}).
		Where("model = ? and channel_id = ? and enabled = ?", normalized, channelID, true).
		Count(&count).Error
	return err == nil && count > 0
}

func isChannelIDInList(list []int, channelID int) bool {
	for _, id := range list {
		if id == channelID {
			return true
		}
	}
	return false
}
