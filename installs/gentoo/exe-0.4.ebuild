# Copyright 1999-2005 Gentoo Foundation
# Distributed under the terms of the GNU General Public License v2
# $Header: $

inherit distutils

DESCRIPTION="off-line authoring environment to assist teachers and academics in the publishing of web content"
HOMEPAGE="http://exe.cfdl.auckland.ac.nz"
SRC_URI="http://eduforge.org/frs/download.php/57/${PN}-source-${PV}.tgz"
LICENSE="GPL-2"
SLOT="0"
KEYWORDS="~x86 ~ppc"
IUSE=""
S="${WORKDIR}/${PN}-source-${PV}"
DEPEND="=www-client/mozilla-firefox-1*
		>=dev-lang/python-2.3
		>=dev-python/twisted-666
		>=dev-python/twisted-web-666"

src_unpack() {
	unpack ${PN}-source-${PV}.tgz
}
