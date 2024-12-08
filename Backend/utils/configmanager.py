import logging
import os
from collections import defaultdict

import toml


class ConfigManager:
    def __init__(self, config_dir, fallback_file=None):
        self.config_dir = config_dir
        self.config = defaultdict(dict)
        self.fallback_file = fallback_file
        self._load_all_configs()

    def _load_all_configs(self):
        logging.debug("Loading all configs...")
        for filename in os.listdir(self.config_dir):
            try:
                if filename.endswith('.toml'):
                    id = filename[:-5]  # Remove the .toml extension to get the ID
                    file_path = os.path.join(self.config_dir, filename)
                    with open(file_path,encoding="utf-8") as f:
                        self.config[id] = toml.load(f)
            except UnicodeDecodeError:
                logging.warning(f"{filename} Cannot be decoded! Check encoding, for now skipping")  # noqa: E501
        logging.debug(f"Loaded configs: {self.config}")

    def get(self, id, title, key, default=None):
        id = str(id)
        logging.debug(f"Getting {id}:{title}:{key}")
        result = self.config.get(id, {}).get(title, {}).get(key, default)
        if result is None and self.fallback_file:
            with open(self.fallback_file) as f:
                fallback_config = toml.load(f)
            fallback_result = fallback_config.get(title, {}).get(key, default)
            if fallback_result is not None:
                logging.debug("Giving fallback result...")
                result = fallback_result
        logging.debug("Final result: " + str(result))
        return result

    def set(self, id, title, key, value):
        logging.debug(f"Setting {id}:{title}:{key} to {value}")
        if id not in self.config:
            self.config[id] = {}
        if title not in self.config[id]:
            self.config[id][title] = {}
        self.config[id][title][key] = value
        self._save_config(id)
        self._load_all_configs()  # Reload all configs after saving
        logging.debug(f"Set {id}:{title}:{key} to {value}")

    def _save_config(self, id):
        id = str(id)
        file_path = os.path.join(self.config_dir, f"{id}.toml")
        logging.debug(f"Saving config for {id} to {file_path}")
        with open(file_path, 'w') as f:
            toml.dump(self.config[id], f)

    def delete(self, id, title=None, key=None):
        id = str(id)
        logging.debug(f"Deleting {id}:{title}:{key}")
        if id in self.config:
            if title and key:
                if title in self.config[id] and key in self.config[id][title]:
                    del self.config[id][title][key]
                    if not self.config[id][title]:  # Clean up empty title section
                        del self.config[id][title]
            elif title:
                if title in self.config[id]:
                    del self.config[id][title]
            else:
                del self.config[id]
            self._save_config(id)
            self._load_all_configs()  # Reload all configs after saving
        logging.debug(f"Deleted {id}:{title}:{key}")

users = ConfigManager("data/users/","data/default_settings.toml")
sessions = ConfigManager("data","data/sessions.toml")
forums = ConfigManager("data/forums")
posts = ConfigManager("data/posts")
