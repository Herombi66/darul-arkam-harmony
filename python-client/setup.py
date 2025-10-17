"""
Setup script for School Management System API Client
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="school-api-client",
    version="1.0.0",
    author="Kilo Code",
    author_email="support@kilocode.com",
    description="Python client library for School Management System API integration",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/kilocode/school-api-client",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Education",
    ],
    python_requires=">=3.7",
    install_requires=[
        "requests>=2.25.0",
        "python-dateutil>=2.8.0",
    ],
    extras_require={
        "dev": [
            "pytest>=6.0",
            "pytest-cov>=2.0",
            "black>=21.0",
            "flake8>=3.9",
            "mypy>=0.800",
        ],
    },
    keywords="school management api client oauth2 integration",
    project_urls={
        "Bug Reports": "https://github.com/kilocode/school-api-client/issues",
        "Source": "https://github.com/kilocode/school-api-client",
        "Documentation": "https://school-api-client.readthedocs.io/",
    },
)