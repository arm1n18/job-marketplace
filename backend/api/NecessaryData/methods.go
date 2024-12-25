package necessarydata

import "github.com/lib/pq"

type NecessaryData struct{}

type Keywords struct {
	Keywords pq.StringArray `json:"keywords"`
}
