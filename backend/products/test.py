import os
import logging

def create():
    try:
        abs_products_dir = os.path.join(os.path.dirname(__file__), '../media/products1')
        abs_products_dir = os.path.abspath(abs_products_dir)
        if not os.path.exists(abs_products_dir):
            os.makedirs(abs_products_dir)
            logging.info(f"Created directory: {abs_products_dir}")
        else:
            logging.info(f"Directory already exists: {abs_products_dir}")
    except Exception as e:
        logging.error(f"Folder creation error: {e}")

create()