<?php

namespace CheckoutWC\Sabberworm\CSS\Property;

use CheckoutWC\Sabberworm\CSS\Comment\Comment;
use CheckoutWC\Sabberworm\CSS\OutputFormat;
use CheckoutWC\Sabberworm\CSS\Value\URL;

/**
 * Class representing an `@import` rule.
 */
class Import implements AtRule
{
    /**
     * @var URL
     */
    private $oLocation;

    /**
     * @var string
     */
    private $sMediaQuery;

    /**
     * @var int
     *
     * @internal since 8.8.0
     */
    protected $iLineNo;

    /**
     * @var array<array-key, Comment>
     *
     * @internal since 8.8.0
     */
    protected $aComments;

    /**
     * @param URL $oLocation
     * @param string $sMediaQuery
     * @param int $iLineNo
     */
    public function __construct(URL $oLocation, $sMediaQuery, $iLineNo = 0)
    {
        $this->oLocation = $oLocation;
        $this->sMediaQuery = $sMediaQuery;
        $this->iLineNo = $iLineNo;
        $this->aComments = [];
    }

    /**
     * @return int
     */
    public function getLineNo()
    {
        return $this->iLineNo;
    }

    /**
     * @param URL $oLocation
     *
     * @return void
     */
    public function setLocation($oLocation)
    {
        $this->oLocation = $oLocation;
    }

    /**
     * @return URL
     */
    public function getLocation()
    {
        return $this->oLocation;
    }

    /**
     * @return string
     *
     * @deprecated in V8.8.0, will be removed in V9.0.0. Use `render` instead.
     */
    public function __toString()
    {
        return $this->render(new OutputFormat());
    }

    /**
     * @param OutputFormat|null $oOutputFormat
     *
     * @return string
     */
    public function render($oOutputFormat)
    {
        return $oOutputFormat->comments($this) . "@import " . $this->oLocation->render($oOutputFormat)
            . ($this->sMediaQuery === null ? '' : ' ' . $this->sMediaQuery) . ';';
    }

    /**
     * @return string
     */
    public function atRuleName()
    {
        return 'import';
    }

    /**
     * @return array<int, URL|string>
     */
    public function atRuleArgs()
    {
        $aResult = [$this->oLocation];
        if ($this->sMediaQuery) {
            array_push($aResult, $this->sMediaQuery);
        }
        return $aResult;
    }

    /**
     * @param array<array-key, Comment> $aComments
     *
     * @return void
     */
    public function addComments(array $aComments)
    {
        $this->aComments = array_merge($this->aComments, $aComments);
    }

    /**
     * @return array<array-key, Comment>
     */
    public function getComments()
    {
        return $this->aComments;
    }

    /**
     * @param array<array-key, Comment> $aComments
     *
     * @return void
     */
    public function setComments(array $aComments)
    {
        $this->aComments = $aComments;
    }

    /**
     * @return string
     */
    public function getMediaQuery()
    {
        return $this->sMediaQuery;
    }
}
