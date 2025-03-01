import sys
sys.path.append('stable-diffusion/ldm')

from ldm.models.diffusion.dpm_solver.sampler import DPMSolverSampler

# Quantization commands

# wget https://huggingface.co/kiwhansong/DFoT/resolve/main/pretrained_models/DFoT_RE10K.ckpt -O DFoT_RE10K.ckpt
# mkdir -p ./DFoT/models/
# mv DFoT_RE10K.ckpt ./DFoT/models/DFoT_RE10K.ckpt



# python sample_diffusion_ddim.py --config ddim/configs/cifar10.yml --timesteps 100 --eta 0 --skip_type quad --wq 4 --ptq --aq 8 -l DFoT --cali --use_aq --cali_save_path DFoT/quantized_models --interval_length 5


# python sample_diffusion_ldm.py -r ./DFoT/models/DFoT_RE10K.ckpt -c 200 -e 1.0 --seed 40 --wq 4 --ptq --aq 8 -l DFOT --cali --use_aq --cali_save_path DFoT/quantized_models --interval_length 10


# python txt2img.py --plms --no_grad_ckpt --ddim_steps 50 --seed 40 --cond --wq 4 --ptq --aq 8 --outdir DFoT --cali --skip_grid --use_aq --ckpt DFoT/models/DFoT_RE10K.ckpt --config configs/stable-diffusion/v1-inference.yaml --data_path re_data/RealEstate10K_Tiny.tar.gz --cali_save_path DFoT/quantized_models


# tar -xvf re_data/RealEstate10K_Mini.tar.gz
