# Copyright 1999-2005 Gentoo Foundation
# Distributed under the terms of the GNU General Public License v2
# $Header: $

inherit distutils

DESCRIPTION="off-line authoring environment to assist teachers and academics in the publishing of web content"
HOMEPAGE="http://exe.cfdl.auckland.ac.nz"
SRC_URI="ftp://ftp.eduforge.org/pub/${PN}/${PN}-${PV}-source.tgz"
LICENSE="GPL-2"
RESTRICT="nomirror" # This is only because it's not in the gentoo tree yet
SLOT="0"
KEYWORDS="~x86 ~ppc"
IUSE=""
S="${WORKDIR}"
DEPEND=">=dev-python/pygtk-2.6.1
		>=dev-python/gnome-python-extras-2.10
		>=www-client/mozilla-1.7.8
		>=dev-python/nevow-0.4.1
		>=dev-python/twisted-2.0.1
		>=dev-python/twisted-web-0.5.0
		>=net-zope/zopeinterface-3.0.1
		>=dev-lang/python-2.4.1"

src_unpack() {
	unpack ${PN}-${PV}-source.tgz
	# Apply config file generation patch
	cd ${S}
	epatch ${FILESDIR}/*.patch
}

src_install() {
	distutils_src_install
}
