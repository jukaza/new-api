package relay_setting

import (
	"sync"

	"github.com/QuantumNous/new-api/common"
)

var globalModelMappingMu sync.RWMutex
var globalModelMappingMap = map[string]string{}

func GlobalModelMapping2JSONString() string {
	globalModelMappingMu.RLock()
	defer globalModelMappingMu.RUnlock()
	if len(globalModelMappingMap) == 0 {
		return ""
	}
	b, _ := common.Marshal(globalModelMappingMap)
	return string(b)
}

func UpdateGlobalModelMappingByJSONString(jsonStr string) error {
	m := make(map[string]string)
	if jsonStr != "" && jsonStr != "{}" {
		if err := common.Unmarshal([]byte(jsonStr), &m); err != nil {
			return err
		}
	}
	globalModelMappingMu.Lock()
	globalModelMappingMap = m
	globalModelMappingMu.Unlock()
	return nil
}

// GetMergedModelMapping trả về JSON mapping đã merge: global + channelMapping
// channelMapping ghi đè key trùng của global
func GetMergedModelMapping(channelMappingJSON string) string {
	globalModelMappingMu.RLock()
	globalCopy := make(map[string]string, len(globalModelMappingMap))
	for k, v := range globalModelMappingMap {
		globalCopy[k] = v
	}
	globalModelMappingMu.RUnlock()

	if channelMappingJSON != "" && channelMappingJSON != "{}" {
		chanMap := make(map[string]string)
		if err := common.Unmarshal([]byte(channelMappingJSON), &chanMap); err == nil {
			for k, v := range chanMap {
				globalCopy[k] = v // channel thắng global
			}
		}
	}

	if len(globalCopy) == 0 {
		return ""
	}
	b, _ := common.Marshal(globalCopy)
	return string(b)
}
