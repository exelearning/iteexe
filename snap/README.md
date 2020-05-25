# Build SNAP Package
The following instructions have been tested on Ubuntu 16.04, 18.04, 19.10.

For more information you can visit the following website: https://snapcraft.io/docs.

#### 1. Install snapcraft
```snap install snapcraft --classic```.

Update path after install snapcraft: ```hash -r```.

#### 2. Get started
Run ```snapcraft init``` in the iteexe directory.

The above command generates a snapcraft.yaml file in the snap directory. We must replace that file with the content of snapcraft.yaml_template.

#### 3. Build snap
Run ```snapcraft``` in the iteexe directory.
In case of using a virtual machine you can run: ```snapcraft --use-lxd```.






