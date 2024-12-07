import os
import sys

# Get the directory of the currently running script (main script)
current_script_directory = os.path.dirname(os.path.abspath(sys.argv[0]))

# Path to the 'scripts' directory (relative to the main script)
scripts_directory = os.path.join(current_script_directory)

os.chdir(scripts_directory)

import utils.configmanager as cm


print(cm.users.config)
